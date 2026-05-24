import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity("lookup_records")
export class LookupRecord {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "national_id_or_code", type: "varchar", length: 64 })
  nationalIdOrCode!: string

  @Column({ name: "student_name", type: "varchar", length: 255, nullable: true })
  studentName?: string | null

  @Column({ name: "license_class", type: "varchar", length: 16, nullable: true })
  licenseClass?: string | null

  @Column({ name: "result_status", type: "varchar", length: 64, nullable: true })
  resultStatus?: string | null

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date
}
