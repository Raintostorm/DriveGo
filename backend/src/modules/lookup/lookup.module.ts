import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LookupRecord } from "../../entities/lookup-record.entity"
import { LookupController } from "./lookup.controller"
import { LookupService } from "./lookup.service"

@Module({
  imports: [TypeOrmModule.forFeature([LookupRecord])],
  controllers: [LookupController],
  providers: [LookupService],
})
export class LookupModule {}
