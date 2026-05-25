import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { Payment } from "./payment.entity"
import { User } from "./user.entity"

@Entity("course_enrollments")
export class CourseEnrollment {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "user_id", type: "uuid" })
  userId!: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user?: User

  @Column({ name: "license_class", type: "varchar", length: 16 })
  licenseClass!: string

  @Column({ type: "varchar", length: 32, default: "pending" })
  status!: string

  @Column({ name: "payment_id", type: "uuid", nullable: true })
  paymentId?: string | null

  @ManyToOne(() => Payment, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "payment_id" })
  payment?: Payment | null

  @Column({ name: "enrolled_at", type: "timestamptz", nullable: true })
  enrolledAt?: Date | null

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date
}
