import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ChatMessage } from "../../entities/chat-message.entity"
import { ChatSession } from "../../entities/chat-session.entity"
import { PremiumModule } from "../../common/premium.module"
import { AuthModule } from "../auth/auth.module"
import { ChatController } from "./chat.controller"
import { ChatService } from "./chat.service"

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession, ChatMessage]), AuthModule, PremiumModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
