import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { TrainingCenter } from "../../entities/schedule-slot.entity"

@Injectable()
export class AdminCentersService {
  constructor(
    @InjectRepository(TrainingCenter)
    private readonly centersRepo: Repository<TrainingCenter>,
  ) {}

  list() {
    return this.centersRepo.find({ order: { name: "ASC" } })
  }

  async create(dto: {
    name: string
    taxCode?: string
    city?: string
    address?: string
  }) {
    const center = this.centersRepo.create(dto)
    return this.centersRepo.save(center)
  }

  async update(
    id: string,
    dto: Partial<{ name: string; taxCode: string; city: string; address: string }>,
  ) {
    const center = await this.centersRepo.findOne({ where: { id } })
    if (!center) throw new NotFoundException("Không tìm thấy trung tâm")
    Object.assign(center, dto)
    return this.centersRepo.save(center)
  }
}
