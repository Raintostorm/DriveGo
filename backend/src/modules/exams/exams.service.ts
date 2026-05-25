import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common"
import {
  DEFAULT_LICENSE_CLASS,
  isStudyLicenseCode,
} from "../../common/license-class.constants"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { EnrollmentService } from "../../common/enrollment.service"
import { PremiumService } from "../../common/premium.service"
import { ExamAttempt } from "../../entities/exam-attempt.entity"
import { ExamPaper } from "../../entities/exam-paper.entity"
import { Question } from "../../entities/question.entity"
import { SubmitAttemptDto } from "./dto/submit-attempt.dto"

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(ExamPaper)
    private readonly papersRepo: Repository<ExamPaper>,
    @InjectRepository(Question)
    private readonly questionsRepo: Repository<Question>,
    @InjectRepository(ExamAttempt)
    private readonly attemptsRepo: Repository<ExamAttempt>,
    private readonly premium: PremiumService,
    private readonly enrollment: EnrollmentService,
  ) {}

  async listPapers(userId: string, licenseClass?: string) {
    const code = licenseClass && isStudyLicenseCode(licenseClass) ? licenseClass : DEFAULT_LICENSE_CLASS
    await this.enrollment.assertEnrolled(userId, code)

    const papers = await this.papersRepo.find({
      where: { licenseClass: code },
      order: { paperNumber: "ASC" },
    })

    const mapped = papers.map((paper) => ({
      id: paper.id,
      licenseClass: paper.licenseClass,
      paperNumber: paper.paperNumber,
      questionCount: paper.questionCount,
      isMock: paper.isMock,
      title: `Đề thi số ${String(paper.paperNumber).padStart(2, "0")}`,
    }))

    return {
      licenseClass: code,
      contentReady: mapped.length > 0,
      papers: mapped,
    }
  }

  async getPaper(paperId: string, userId: string) {
    const paper = await this.papersRepo.findOne({ where: { id: paperId } })
    if (!paper) {
      throw new NotFoundException("Không tìm thấy đề thi")
    }

    await this.enrollment.assertEnrolled(userId, paper.licenseClass)

    const questions = await this.questionsRepo.find({
      where: { paperId },
      order: { id: "ASC" },
    })

    return {
      id: paper.id,
      licenseClass: paper.licenseClass,
      paperNumber: paper.paperNumber,
      questionCount: paper.questionCount,
      isMock: paper.isMock,
      title: `Đề thi số ${String(paper.paperNumber).padStart(2, "0")}`,
      questions: questions.map((q, index) => ({
        id: q.id,
        index: index + 1,
        body: q.body,
        imageUrl: q.imageUrl,
        answers: q.answers,
        isCritical: q.isCritical,
        correctIndex: q.correctIndex,
      })),
    }
  }

  async submitAttempt(userId: string, paperId: string, dto: SubmitAttemptDto) {
    const paper = await this.papersRepo.findOne({ where: { id: paperId } })
    if (!paper) {
      throw new NotFoundException("Không tìm thấy đề thi")
    }

    await this.enrollment.assertEnrolled(userId, paper.licenseClass)
    await this.premium.assertCanSubmitExam(userId)

    const questions = await this.questionsRepo.find({ where: { paperId } })
    if (questions.length === 0) {
      throw new NotFoundException("Đề thi chưa có câu hỏi")
    }

    let correct = 0
    let wrong = 0
    let failedCritical = false
    const detail: Record<string, { selected: number; correct: number; isCorrect: boolean }> = {}

    for (const question of questions) {
      const selected = dto.answers[question.id]
      const isCorrect =
        typeof selected === "number" && selected === question.correctIndex
      detail[question.id] = {
        selected: selected ?? -1,
        correct: question.correctIndex,
        isCorrect,
      }
      if (isCorrect) {
        correct += 1
      } else {
        wrong += 1
        if (question.isCritical) {
          failedCritical = true
        }
      }
    }

    const total = questions.length
    const passThreshold = Math.ceil(total * 0.8)
    const passed = !failedCritical && correct >= passThreshold

    const startedAt = dto.startedAt ? new Date(dto.startedAt) : new Date()
    const finishedAt = new Date()

    const attempt = this.attemptsRepo.create({
      userId,
      paperId,
      startedAt,
      finishedAt,
      score: correct,
      passed,
      answers: { correct, wrong, detail },
    })
    await this.attemptsRepo.save(attempt)

    return {
      attemptId: attempt.id,
      score: correct,
      total,
      correct,
      wrong,
      passed,
      passThreshold,
      durationSeconds: Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000),
    }
  }

  async getHistory(userId: string) {
    const attempts = await this.attemptsRepo.find({
      where: { userId },
      relations: { paper: true },
      order: { finishedAt: "DESC" },
    })

    const rows = attempts.map((attempt) => {
      const total = attempt.paper?.questionCount ?? attempt.score ?? 0
      const finished = attempt.finishedAt ?? attempt.startedAt
      const durationMs =
        finished.getTime() -
        attempt.startedAt.getTime()
      const minutes = Math.floor(durationMs / 60000)
      const seconds = Math.floor((durationMs % 60000) / 1000)

      return {
        id: attempt.id,
        date: finished.toISOString(),
        exam: attempt.paper
          ? `Đề thi số ${String(attempt.paper.paperNumber).padStart(2, "0")}`
          : "Đề thi",
        rank: attempt.paper?.licenseClass ?? "B2",
        score: `${attempt.score ?? 0}/${total}`,
        pass: Boolean(attempt.passed),
        time: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      }
    })

    const totalExams = rows.length
    const passCount = rows.filter((r) => r.pass).length
    const passRate = totalExams ? Math.round((passCount / totalExams) * 100) : 0
    const bestScore = rows.reduce((best, row) => {
      const [got, of] = row.score.split("/").map(Number)
      const pct = of ? got / of : 0
      return pct > best.pct ? { text: row.score, pct } : best
    }, { text: "0/0", pct: 0 })

    return {
      stats: {
        totalExams,
        passRate: `${passRate}%`,
        bestScore: bestScore.text,
      },
      rows,
    }
  }
}
