import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { LookupRecord } from "../../entities/lookup-record.entity"

@Injectable()
export class LookupService {
  constructor(
    @InjectRepository(LookupRecord)
    private readonly lookupRepo: Repository<LookupRecord>,
  ) {}

  async search(code: string) {
    const trimmed = code.trim()
    if (!trimmed) {
      throw new NotFoundException("Không tìm thấy hồ sơ")
    }

    const record = await this.lookupRepo.findOne({
      where: { nationalIdOrCode: trimmed },
    })

    if (!record) {
      throw new NotFoundException("Không tìm thấy hồ sơ với mã đã nhập")
    }

    return {
      code: record.nationalIdOrCode,
      studentName: record.studentName,
      licenseClass: record.licenseClass,
      resultStatus: record.resultStatus,
      updatedAt: record.updatedAt,
    }
  }
}
