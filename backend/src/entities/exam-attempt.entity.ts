import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ExamPaper } from "./exam-paper.entity"
import { User } from "./user.entity"

@Entity("exam_attempts")
export class ExamAttempt {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "user_id", type: "uuid" })
  userId!: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User

  @Column({ name: "paper_id", type: "uuid" })
  paperId!: string

  @ManyToOne(() => ExamPaper)
  @JoinColumn({ name: "paper_id" })
  paper!: ExamPaper

  @CreateDateColumn({ name: "started_at", type: "timestamptz" })
  startedAt!: Date

  @Column({ name: "finished_at", type: "timestamptz", nullable: true })
  finishedAt?: Date | null

  @Column({ type: "int", nullable: true })
  score?: number | null

  @Column({ type: "boolean", nullable: true })
  passed?: boolean | null

  @Column({ type: "jsonb", nullable: true })
  answers?: Record<string, unknown> | null
}
