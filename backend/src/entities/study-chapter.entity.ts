import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { LicenseClass } from "./license-class.entity"

@Entity("study_chapters")
export class StudyChapter {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "license_class_id", type: "uuid", nullable: true })
  licenseClassId?: string | null

  @ManyToOne(() => LicenseClass, { nullable: true })
  @JoinColumn({ name: "license_class_id" })
  licenseClass?: LicenseClass

  @Column({ type: "varchar", length: 255 })
  title!: string

  @Column({ name: "sort_order", type: "int", default: 0 })
  sortOrder!: number

  @Column({ name: "duration_minutes", type: "int", nullable: true })
  durationMinutes?: number | null

  @Column({ name: "video_url", type: "text", nullable: true })
  videoUrl?: string | null

  @Column({ type: "text", nullable: true })
  description?: string | null

  @Column({ name: "is_published", type: "boolean", default: true })
  isPublished!: boolean
}
