import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { LicenseApplication } from "./license-application.entity"

@Entity("application_documents")
export class ApplicationDocument {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "application_id", type: "uuid" })
  applicationId!: string

  @ManyToOne(() => LicenseApplication, (app) => app.documents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "application_id" })
  application!: LicenseApplication

  @Column({ name: "doc_type", type: "varchar", length: 32 })
  docType!: string

  @Column({ name: "slot_index", type: "int", default: 0 })
  slotIndex!: number

  @Column({ name: "file_path", type: "text" })
  filePath!: string

  @Column({ name: "original_name", type: "varchar", length: 255, nullable: true })
  originalName?: string | null

  @Column({ name: "mime_type", type: "varchar", length: 128, nullable: true })
  mimeType?: string | null

  @CreateDateColumn({ name: "uploaded_at", type: "timestamptz" })
  uploadedAt!: Date
}
