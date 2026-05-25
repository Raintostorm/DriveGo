import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { ClassSession } from "./class-session.entity"
import { User } from "./user.entity"

@Entity("session_attendance")
export class SessionAttendance {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "session_id", type: "uuid" })
  sessionId!: string

  @ManyToOne(() => ClassSession, (s) => s.attendance, { onDelete: "CASCADE" })
  @JoinColumn({ name: "session_id" })
  session?: ClassSession

  @Column({ name: "user_id", type: "uuid" })
  userId!: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User

  @Column({ name: "checked_in_at", type: "timestamptz" })
  checkedInAt!: Date

  @Column({ type: "varchar", length: 16, default: "self" })
  method!: string
}
