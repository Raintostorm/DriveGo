import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Payment } from "../../entities/payment.entity"
import { StudentProfile } from "../../entities/student-profile.entity"
import { SubscriptionPlan } from "../../entities/subscription-plan.entity"
import { PaymentsController } from "./payments.controller"
import { PaymentsService } from "./payments.service"
import { SepayConfigService } from "./sepay-config.service"

@Module({
  imports: [TypeOrmModule.forFeature([Payment, SubscriptionPlan, StudentProfile])],
  controllers: [PaymentsController],
  providers: [PaymentsService, SepayConfigService],
})
export class PaymentsModule {}
