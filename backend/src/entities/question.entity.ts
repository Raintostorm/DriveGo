import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { ExamPaper } from "./exam-paper.entity"

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "paper_id", type: "uuid", nullable: true })
  paperId?: string | null

  @ManyToOne(() => ExamPaper, (paper) => paper.questions, { onDelete: "SET NULL" })
  @JoinColumn({ name: "paper_id" })
  paper?: ExamPaper

  @Column({ type: "text" })
  body!: string

  @Column({ name: "image_url", type: "text", nullable: true })
  imageUrl?: string | null

  @Column({ type: "jsonb" })
  answers!: string[]

  @Column({ name: "correct_index", type: "int" })
  correctIndex!: number

  @Column({ name: "is_critical", type: "boolean", default: false })
  isCritical!: boolean
}
