import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { LicenseClass } from "../../entities/license-class.entity"
import { StudyChapter } from "../../entities/study-chapter.entity"
import { StudyProgress } from "../../entities/study-progress.entity"

@Injectable()
export class StudyService {
  constructor(
    @InjectRepository(StudyChapter)
    private readonly chaptersRepo: Repository<StudyChapter>,
    @InjectRepository(StudyProgress)
    private readonly progressRepo: Repository<StudyProgress>,
    @InjectRepository(LicenseClass)
    private readonly licenseRepo: Repository<LicenseClass>,
  ) {}

  async listChapters(userId: string | null, licenseClassCode = "B2") {
    const license = await this.licenseRepo.findOne({ where: { code: licenseClassCode } })
    if (!license) {
      return []
    }

    const chapters = await this.chaptersRepo.find({
      where: { licenseClassId: license.id },
      order: { sortOrder: "ASC" },
    })

    let progressMap = new Map<string, StudyProgress>()
    if (userId) {
      const progressRows = await this.progressRepo.find({
        where: { userId },
      })
      progressMap = new Map(progressRows.map((p) => [p.chapterId, p]))
    }

    return chapters.map((chapter) => {
      const progress = progressMap.get(chapter.id)
      return {
        id: chapter.id,
        title: chapter.title,
        sortOrder: chapter.sortOrder,
        durationMinutes: chapter.durationMinutes,
        videoUrl: chapter.videoUrl,
        description: chapter.description,
        percent: progress?.percent ?? 0,
        completedLessons: progress?.completedLessons ?? 0,
      }
    })
  }

  async getChapter(userId: string | null, chapterId: string) {
    const chapter = await this.chaptersRepo.findOne({ where: { id: chapterId } })
    if (!chapter) {
      throw new NotFoundException("Không tìm thấy chương học")
    }

    let progress = null
    if (userId) {
      progress = await this.progressRepo.findOne({
        where: { userId, chapterId },
      })
    }

    return {
      id: chapter.id,
      title: chapter.title,
      durationMinutes: chapter.durationMinutes,
      videoUrl: chapter.videoUrl,
      description: chapter.description,
      percent: progress?.percent ?? 0,
      completedLessons: progress?.completedLessons ?? 0,
    }
  }

  async updateProgress(userId: string, chapterId: string, percent: number) {
    const chapter = await this.chaptersRepo.findOne({ where: { id: chapterId } })
    if (!chapter) {
      throw new NotFoundException("Không tìm thấy chương học")
    }

    const clamped = Math.min(100, Math.max(0, percent))
    let progress = await this.progressRepo.findOne({
      where: { userId, chapterId },
    })

    if (!progress) {
      progress = this.progressRepo.create({
        userId,
        chapterId,
        percent: clamped,
        completedLessons: clamped >= 100 ? 1 : 0,
      })
    } else {
      progress.percent = Math.max(progress.percent, clamped)
      if (clamped >= 100) {
        progress.completedLessons += 1
      }
    }

    await this.progressRepo.save(progress)

    return {
      chapterId,
      percent: progress.percent,
      completedLessons: progress.completedLessons,
    }
  }
}
