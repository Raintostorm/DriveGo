import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { User } from "./user.entity"
import { ChatMessage } from "./chat-message.entity"

@Entity("chat_sessions")
export class ChatSession {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "user_id", type: "uuid" })
  userId!: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User

  @Column({ type: "varchar", length: 255, nullable: true })
  title?: string | null

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date

  @OneToMany(() => ChatMessage, (message) => message.session)
  messages?: ChatMessage[]
}
