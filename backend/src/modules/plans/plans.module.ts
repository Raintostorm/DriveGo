import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LicenseClass } from "../../entities/license-class.entity"
import { SubscriptionPlan } from "../../entities/subscription-plan.entity"
import { PlansController } from "./plans.controller"
import { PlansService } from "./plans.service"

@Module({
  imports: [TypeOrmModule.forFeature([LicenseClass, SubscriptionPlan])],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
