import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"
import { ApplicationDocument } from "./application-document.entity"
import { TrainingCenter } from "./schedule-slot.entity"
import { User } from "./user.entity"

export type ApplicationStatus = "draft" | "submitted" | "reviewing" | "approved" | "rejected"

@Entity("license_applications")
export class LicenseApplication {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "user_id", type: "uuid" })
  userId!: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User

  @Column({ name: "license_class", type: "varchar", length: 16, default: "B2" })
  licenseClass!: string

  @Column({ name: "center_id", type: "uuid", nullable: true })
  centerId?: string | null

  @ManyToOne(() => TrainingCenter, { nullable: true })
  @JoinColumn({ name: "center_id" })
  center?: TrainingCenter | null

  @Column({ type: "varchar", length: 32, default: "draft" })
  status!: ApplicationStatus

  @Column({ name: "personal_info", type: "jsonb", default: {} })
  personalInfo!: Record<string, unknown>

  @Column({ name: "submitted_at", type: "timestamptz", nullable: true })
  submittedAt?: Date | null

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date

  @OneToMany(() => ApplicationDocument, (doc) => doc.application)
  documents?: ApplicationDocument[]
}
