import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { createReadStream, existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs"
import { join, extname } from "path"
import { randomUUID } from "crypto"
import { Repository } from "typeorm"
import { ApplicationDocument } from "../../entities/application-document.entity"
import { LicenseApplication } from "../../entities/license-application.entity"
import {
  isValidDocType,
  maxSlotIndex,
  OPTIONAL_DOCUMENT_SLOTS,
  REQUIRED_DOCUMENT_SLOTS,
} from "./application-doc-types"
import { UpdateApplicationDto } from "./dto/update-application.dto"

const MAX_FILE_BYTES = 5 * 1024 * 1024
const UPLOAD_DIR = join(process.cwd(), "uploads", "applications")

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(LicenseApplication)
    private readonly appsRepo: Repository<LicenseApplication>,
    @InjectRepository(ApplicationDocument)
    private readonly docsRepo: Repository<ApplicationDocument>,
  ) {
    mkdirSync(UPLOAD_DIR, { recursive: true })
  }

  async hasSubmittedApplication(userId: string) {
    const app = await this.appsRepo.findOne({
      where: { userId },
      order: { updatedAt: "DESC" },
    })
    return this.isExamEligible(app?.status)
  }

  async assertSubmittedForExam(userId: string) {
    const ok = await this.hasSubmittedApplication(userId)
    if (!ok) {
      throw new ForbiddenException(
        "Cần nộp hồ sơ sát hạch (đủ giấy tờ theo quy định mới nhất) trước khi thi thử hoặc đăng ký ca thi.",
      )
    }
  }

  async getMyApplication(userId: string) {
    const app = await this.findLatestForUser(userId)
    if (!app) {
      return {
        application: null,
        examEligible: false,
      }
    }
    return {
      application: this.toResponse(app),
      examEligible: this.isExamEligible(app.status),
    }
  }

  private isExamEligible(status?: string) {
    return status === "submitted" || status === "reviewing" || status === "approved"
  }

  async createDraft(userId: string, licenseClass = "B2") {
    const existing = await this.appsRepo.findOne({
      where: { userId, status: "draft" },
      order: { createdAt: "DESC" },
    })
    if (existing) {
      return {
        application: this.toResponse(existing),
        examEligible: this.isExamEligible(existing.status),
      }
    }

    const app = this.appsRepo.create({
      userId,
      licenseClass,
      status: "draft",
      personalInfo: {},
    })
    await this.appsRepo.save(app)
    return {
      application: this.toResponse(app),
      examEligible: false,
    }
  }

  async updateApplication(userId: string, id: string, dto: UpdateApplicationDto) {
    const app = await this.getOwnedApplication(userId, id)
    if (app.status !== "draft") {
      throw new BadRequestException("Chỉ được sửa hồ sơ ở trạng thái nháp")
    }

    if (dto.licenseClass !== undefined) app.licenseClass = dto.licenseClass
    if (dto.personalInfo !== undefined) {
      app.personalInfo = { ...(app.personalInfo ?? {}), ...dto.personalInfo }
    }

    await this.appsRepo.save(app)
    const reloaded = await this.appsRepo.findOne({
      where: { id: app.id },
      relations: { documents: true },
    })
    return {
      application: this.toResponse(reloaded!),
      examEligible: this.isExamEligible(reloaded!.status),
    }
  }

  async uploadDocument(
    userId: string,
    applicationId: string,
    file: Express.Multer.File,
    docType: string,
    slotIndex: number,
  ) {
    const app = await this.getOwnedApplication(userId, applicationId)
    if (app.status !== "draft") {
      throw new BadRequestException("Không thể upload khi hồ sơ đã nộp")
    }

    if (!isValidDocType(docType)) {
      throw new BadRequestException("Loại tài liệu không hợp lệ")
    }

    const maxSlot = maxSlotIndex(docType)
    if (slotIndex < 0 || slotIndex > maxSlot) {
      throw new BadRequestException(`slot_index phải từ 0 đến ${maxSlot}`)
    }

    if (!file?.buffer?.length) {
      throw new BadRequestException("Thiếu file upload")
    }

    if (file.size > MAX_FILE_BYTES) {
      throw new BadRequestException("File tối đa 5MB")
    }

    const mime = file.mimetype ?? ""
    if (!mime.startsWith("image/") && mime !== "application/pdf") {
      throw new BadRequestException("Chỉ chấp nhận ảnh hoặc PDF")
    }

    const ext = extname(file.originalname) || (mime === "application/pdf" ? ".pdf" : ".jpg")
    const storedName = `${applicationId}_${docType}_${slotIndex}_${randomUUID()}${ext}`
    const absolutePath = join(UPLOAD_DIR, storedName)
    writeFileSync(absolutePath, file.buffer)

    const relativePath = join("applications", storedName)

    const existing = await this.docsRepo.findOne({
      where: { applicationId, docType, slotIndex },
    })
    if (existing?.filePath) {
      const oldAbs = join(process.cwd(), "uploads", existing.filePath)
      if (existsSync(oldAbs)) unlinkSync(oldAbs)
      await this.docsRepo.remove(existing)
    }

    const doc = this.docsRepo.create({
      applicationId,
      docType,
      slotIndex,
      filePath: relativePath.replace(/\\/g, "/"),
      originalName: file.originalname,
      mimeType: mime,
    })
    await this.docsRepo.save(doc)

    const reloaded = await this.appsRepo.findOne({
      where: { id: applicationId },
      relations: { documents: true },
    })
    return {
      application: this.toResponse(reloaded!),
      examEligible: this.isExamEligible(reloaded!.status),
    }
  }

  async submitApplication(userId: string, applicationId: string) {
    const app = await this.getOwnedApplication(userId, applicationId)
    if (app.status !== "draft") {
      throw new BadRequestException("Hồ sơ đã được nộp")
    }

    const docs = await this.docsRepo.find({ where: { applicationId } })
    const missing: string[] = []

    for (const [docType, count] of Object.entries(REQUIRED_DOCUMENT_SLOTS)) {
      for (let slot = 0; slot < count; slot += 1) {
        const found = docs.some((d) => d.docType === docType && d.slotIndex === slot)
        if (!found) missing.push(`${docType}[${slot}]`)
      }
    }

    if (missing.length > 0) {
      throw new BadRequestException(
        `Thiếu tài liệu bắt buộc: ${missing.join(", ")}`,
      )
    }

    app.status = "submitted"
    app.submittedAt = new Date()
    await this.appsRepo.save(app)

    const reloaded = await this.appsRepo.findOne({
      where: { id: applicationId },
      relations: { documents: true },
    })
    return {
      application: this.toResponse(reloaded!),
      examEligible: true,
    }
  }

  async getDocumentFile(userId: string, documentId: string) {
    const doc = await this.docsRepo.findOne({
      where: { id: documentId },
      relations: { application: true },
    })
    if (!doc) throw new NotFoundException("Không tìm thấy tài liệu")
    if (doc.application.userId !== userId) {
      throw new ForbiddenException("Không có quyền xem file")
    }

    const absolutePath = join(process.cwd(), "uploads", doc.filePath)
    if (!existsSync(absolutePath)) {
      throw new NotFoundException("File không tồn tại trên máy chủ")
    }

    return {
      stream: createReadStream(absolutePath),
      mimeType: doc.mimeType ?? "application/octet-stream",
      originalName: doc.originalName ?? "document",
    }
  }

  private async findLatestForUser(userId: string) {
    return this.appsRepo.findOne({
      where: { userId },
      relations: { documents: true },
      order: { updatedAt: "DESC" },
    })
  }

  private async getOwnedApplication(userId: string, id: string) {
    const app = await this.appsRepo.findOne({
      where: { id, userId },
      relations: { documents: true },
    })
    if (!app) throw new NotFoundException("Không tìm thấy hồ sơ")
    return app
  }

  private toResponse(app: LicenseApplication) {
    const documents = (app.documents ?? []).map((d) => ({
      id: d.id,
      docType: d.docType,
      slotIndex: d.slotIndex,
      originalName: d.originalName,
      mimeType: d.mimeType,
      uploadedAt: d.uploadedAt,
      fileUrl: `/api/applications/documents/${d.id}/file`,
    }))

    const uploadedKeys = new Set(
      documents.map((d) => `${d.docType}:${d.slotIndex}`),
    )

    const requirements = {
      required: Object.entries(REQUIRED_DOCUMENT_SLOTS).flatMap(([docType, count]) =>
        Array.from({ length: count }, (_, slotIndex) => ({
          docType,
          slotIndex,
          uploaded: uploadedKeys.has(`${docType}:${slotIndex}`),
        })),
      ),
      optional: Object.entries(OPTIONAL_DOCUMENT_SLOTS).flatMap(([docType, count]) =>
        Array.from({ length: count }, (_, slotIndex) => ({
          docType,
          slotIndex,
          uploaded: uploadedKeys.has(`${docType}:${slotIndex}`),
        })),
      ),
    }

    return {
      id: app.id,
      licenseClass: app.licenseClass,
      status: app.status,
      personalInfo: app.personalInfo ?? {},
      submittedAt: app.submittedAt,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      documents,
      requirements,
    }
  }
}
