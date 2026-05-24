import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { User } from "./user.entity"

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "user_id", type: "uuid" })
  userId!: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User

  @Column({ type: "varchar", length: 64 })
  type!: string

  @Column({ type: "varchar", length: 255 })
  title!: string

  @Column({ type: "text", nullable: true })
  body?: string | null

  @Column({ name: "read_at", type: "timestamptz", nullable: true })
  readAt?: Date | null

  @Column({ name: "action_url", type: "text", nullable: true })
  actionUrl?: string | null

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date
}
