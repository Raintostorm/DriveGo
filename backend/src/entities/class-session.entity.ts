import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { TrainingCenter } from "./schedule-slot.entity"
import { User } from "./user.entity"
import { SessionAttendance } from "./session-attendance.entity"

@Entity("class_sessions")
export class ClassSession {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "center_id", type: "uuid" })
  centerId!: string

  @ManyToOne(() => TrainingCenter, { onDelete: "CASCADE" })
  @JoinColumn({ name: "center_id" })
  center?: TrainingCenter

  @Column({ type: "varchar", length: 255 })
  title!: string

  @Column({ name: "session_date", type: "date" })
  sessionDate!: string

  @Column({ name: "start_time", type: "time" })
  startTime!: string

  @Column({ name: "end_time", type: "time" })
  endTime!: string

  @Column({ type: "varchar", length: 255, nullable: true })
  venue?: string | null

  @Column({ name: "session_type", type: "varchar", length: 32, default: "theory" })
  sessionType!: string

  @Column({ name: "license_class", type: "varchar", length: 16, nullable: true })
  licenseClass?: string | null

  @Column({ name: "max_capacity", type: "int", default: 30 })
  maxCapacity!: number

  @Column({ name: "created_by", type: "uuid", nullable: true })
  createdBy?: string | null

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "created_by" })
  creator?: User

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date

  @OneToMany(() => SessionAttendance, (a) => a.session)
  attendance?: SessionAttendance[]
}
