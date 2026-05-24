import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ChatSession } from "./chat-session.entity"

@Entity("chat_messages")
export class ChatMessage {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "session_id", type: "uuid" })
  sessionId!: string

  @ManyToOne(() => ChatSession, (session) => session.messages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "session_id" })
  session!: ChatSession

  @Column({ type: "varchar", length: 16 })
  role!: string

  @Column({ type: "text" })
  content!: string

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date
}
