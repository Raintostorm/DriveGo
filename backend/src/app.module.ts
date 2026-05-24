import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { DatabaseModule } from "./database/database.module"
import { FirebaseModule } from "./firebase/firebase.module"
import { ApplicationsModule } from "./modules/applications/applications.module"
import { ArticlesModule } from "./modules/articles/articles.module"
import { AuthModule } from "./modules/auth/auth.module"
import { CentersModule } from "./modules/centers/centers.module"
import { ChatModule } from "./modules/chat/chat.module"
import { ExamsModule } from "./modules/exams/exams.module"
import { HealthModule } from "./modules/health/health.module"
import { LookupModule } from "./modules/lookup/lookup.module"
import { NotificationsModule } from "./modules/notifications/notifications.module"
import { PaymentsModule } from "./modules/payments/payments.module"
import { PlansModule } from "./modules/plans/plans.module"
import { SchedulesModule } from "./modules/schedules/schedules.module"
import { StudyModule } from "./modules/study/study.module"
import { UsersModule } from "./modules/users/users.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    FirebaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ExamsModule,
    StudyModule,
    SchedulesModule,
    NotificationsModule,
    ArticlesModule,
    PlansModule,
    PaymentsModule,
    ApplicationsModule,
    LookupModule,
    CentersModule,
    ChatModule,
  ],
})
export class AppModule {}
