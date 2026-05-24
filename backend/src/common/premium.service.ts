import { ForbiddenException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { IsNull, Not, Repository } from "typeorm"
import { ExamAttempt } from "../entities/exam-attempt.entity"
import { StudentProfile } from "../entities/student-profile.entity"

export const FREE_EXAM_ATTEMPT_LIMIT = 10

@Injectable()
export class PremiumService {
  constructor(
    @InjectRepository(StudentProfile)
    private readonly profilesRepo: Repository<StudentProfile>,
    @InjectRepository(ExamAttempt)
    private readonly attemptsRepo: Repository<ExamAttempt>,
  ) {}

  async isPremium(userId: string): Promise<boolean> {
    const profile = await this.profilesRepo.findOne({ where: { userId } })
    if (!profile?.premiumUntil) return false
    return profile.premiumUntil.getTime() > Date.now()
  }

  async countFinishedAttempts(userId: string): Promise<number> {
    return this.attemptsRepo.count({
      where: { userId, finishedAt: Not(IsNull()) },
    })
  }

  async assertPremiumForChat(userId: string) {
    if (await this.isPremium(userId)) return
    throw new ForbiddenException(
      "AI Chat chỉ dành cho tài khoản Premium. Vui lòng nâng cấp tại trang Nâng cấp.",
    )
  }

  async assertCanSubmitExam(userId: string) {
    if (await this.isPremium(userId)) return
    const count = await this.countFinishedAttempts(userId)
    if (count >= FREE_EXAM_ATTEMPT_LIMIT) {
      throw new ForbiddenException(
        `Tài khoản miễn phí chỉ được nộp tối đa ${FREE_EXAM_ATTEMPT_LIMIT} bài thi. Nâng cấp Premium để thi không giới hạn.`,
      )
    }
  }
}
