import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./user.entity"

@Entity("training_centers")
export class TrainingCenter {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ type: "varchar", length: 255 })
  name!: string

  @Column({ name: "tax_code", type: "varchar", length: 64, nullable: true })
  taxCode?: string | null

  @Column({ type: "varchar", length: 128, nullable: true })
  city?: string | null

  @Column({ type: "text", nullable: true })
  address?: string | null
}

@Entity("schedule_slots")
export class ScheduleSlot {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "center_id", type: "uuid", nullable: true })
  centerId?: string | null

  @ManyToOne(() => TrainingCenter, { nullable: true })
  @JoinColumn({ name: "center_id" })
  center?: TrainingCenter

  @Column({ name: "slot_date", type: "date" })
  slotDate!: string

  @Column({ name: "start_time", type: "time" })
  startTime!: string

  @Column({ name: "end_time", type: "time" })
  endTime!: string

  @Column({ type: "varchar", length: 255, nullable: true })
  venue?: string | null

  @Column({ name: "license_class", type: "varchar", length: 16, nullable: true })
  licenseClass?: string | null

  @Column({ name: "slot_type", type: "varchar", length: 32, default: "theory_exam" })
  slotType!: string

  @Column({ type: "int", default: 0 })
  capacity!: number

  @Column({ name: "registered_count", type: "int", default: 0 })
  registeredCount!: number

  @Column({ name: "created_by", type: "uuid", nullable: true })
  createdBy?: string | null
}

@Entity("exam_registrations")
export class ExamRegistration {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "user_id", type: "uuid" })
  userId!: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User

  @Column({ name: "slot_id", type: "uuid" })
  slotId!: string

  @ManyToOne(() => ScheduleSlot, { onDelete: "CASCADE" })
  @JoinColumn({ name: "slot_id" })
  slot?: ScheduleSlot

  @Column({ type: "varchar", length: 32, default: "pending" })
  status!: string

  @Column({ name: "admin_note", type: "text", nullable: true })
  adminNote?: string | null

  @Column({ name: "reviewed_at", type: "timestamptz", nullable: true })
  reviewedAt?: Date | null

  @Column({ name: "reviewed_by", type: "uuid", nullable: true })
  reviewedBy?: string | null
}
