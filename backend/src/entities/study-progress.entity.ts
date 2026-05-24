import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { StudyChapter } from "./study-chapter.entity"
import { User } from "./user.entity"

@Entity("study_progress")
export class StudyProgress {
  @PrimaryColumn({ name: "user_id", type: "uuid" })
  userId!: string

  @PrimaryColumn({ name: "chapter_id", type: "uuid" })
  chapterId!: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User

  @ManyToOne(() => StudyChapter, { onDelete: "CASCADE" })
  @JoinColumn({ name: "chapter_id" })
  chapter!: StudyChapter

  @Column({ name: "completed_lessons", type: "int", default: 0 })
  completedLessons!: number

  @Column({ type: "int", default: 0 })
  percent!: number
}
