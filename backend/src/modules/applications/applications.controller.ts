import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import type { Response } from "express"
import { memoryStorage } from "multer"
import { CurrentUser } from "../../common/current-user.decorator"
import { AuthUser } from "../auth/jwt.strategy"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { ApplicationsService } from "./applications.service"
import { UpdateApplicationDto } from "./dto/update-application.dto"

@Controller("applications")
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get("me")
  getMe(@CurrentUser() user: AuthUser) {
    return this.applicationsService.getMyApplication(user.userId)
  }

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body("licenseClass") licenseClass?: string,
  ) {
    return this.applicationsService.createDraft(user.userId, licenseClass ?? "B2")
  }

  @Patch(":id")
  update(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body() body: UpdateApplicationDto,
  ) {
    return this.applicationsService.updateApplication(user.userId, id, body)
  }

  @Post(":id/documents")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadDocument(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Query("docType") docType: string,
    @Query("slotIndex") slotIndex?: string,
  ) {
    const slot = slotIndex !== undefined && slotIndex !== "" ? Number(slotIndex) : 0
    return this.applicationsService.uploadDocument(
      user.userId,
      id,
      file,
      docType,
      Number.isFinite(slot) ? slot : 0,
    )
  }

  @Post(":id/submit")
  submit(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.applicationsService.submitApplication(user.userId, id)
  }

  @Get("documents/:documentId/file")
  async getFile(
    @CurrentUser() user: AuthUser,
    @Param("documentId") documentId: string,
    @Res() res: Response,
  ) {
    const { stream, mimeType, originalName } =
      await this.applicationsService.getDocumentFile(user.userId, documentId)
    res.setHeader("Content-Type", mimeType)
    res.setHeader("Content-Disposition", `inline; filename="${originalName}"`)
    stream.pipe(res)
  }
}
