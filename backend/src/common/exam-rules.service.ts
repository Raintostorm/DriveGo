import { Injectable, NotFoundException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import {
  DEFAULT_LICENSE_CLASS,
  isStudyLicenseCode,
  type StudyLicenseCode,
} from "./license-class.constants"
import { LicenseClass } from "../entities/license-class.entity"

export type ExamRulesDto = {
  questionsPerExam: number
  durationMinutes: number
  passMinCorrect: number
  bankQuestionCount: number
  papersCount: number
}

@Injectable()
export class ExamRulesService {
  constructor(
    @InjectRepository(LicenseClass)
    private readonly licenseRepo: Repository<LicenseClass>,
    private readonly config: ConfigService,
  ) {}

  private envInt(key: string): number | undefined {
    const raw = this.config.get<string>(key)
    if (raw === undefined || raw === "") return undefined
    const n = Number(raw)
    return Number.isFinite(n) ? n : undefined
  }

  private overrideForCode(code: StudyLicenseCode, row: LicenseClass): ExamRulesDto {
    const passKey = `EXAM_PASS_MIN_${code}` as const
    const durationKey = `EXAM_DURATION_MINUTES_${code}` as const
    return {
      questionsPerExam: row.questionsPerExam,
      durationMinutes: this.envInt(durationKey) ?? row.examDurationMinutes,
      passMinCorrect: this.envInt(passKey) ?? row.passMinCorrect,
      bankQuestionCount: row.bankQuestionCount,
      papersCount: row.papersCount,
    }
  }

  async getRules(licenseClass?: string): Promise<ExamRulesDto> {
    const code =
      licenseClass && isStudyLicenseCode(licenseClass) ? licenseClass : DEFAULT_LICENSE_CLASS
    const row = await this.licenseRepo.findOne({ where: { code } })
    if (!row) {
      throw new NotFoundException(`Không tìm thấy hạng GPLX: ${code}`)
    }
    return this.overrideForCode(code, row)
  }

  toCatalogPayload(row: LicenseClass): ExamRulesDto {
    const code = row.code as StudyLicenseCode
    if (!isStudyLicenseCode(code)) {
      return {
        questionsPerExam: row.questionsPerExam,
        durationMinutes: row.examDurationMinutes,
        passMinCorrect: row.passMinCorrect,
        bankQuestionCount: row.bankQuestionCount,
        papersCount: row.papersCount,
      }
    }
    return this.overrideForCode(code, row)
  }
}
