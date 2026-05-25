import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("license_classes")
export class LicenseClass {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ type: "varchar", length: 16, unique: true })
  code!: string

  @Column({ type: "numeric", precision: 12, scale: 2, nullable: true })
  price?: string | null

  @Column({ name: "enrollment_fee", type: "numeric", precision: 12, scale: 2, default: 5000 })
  enrollmentFee!: string

  @Column({ type: "text", nullable: true })
  description?: string | null
}
