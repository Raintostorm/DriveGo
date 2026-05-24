import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { StudentProfile } from "./student-profile.entity"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ unique: true })
  email!: string

  @Column({ name: "password_hash" })
  passwordHash!: string

  @Column({ type: "varchar", length: 32 })
  role!: string

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date

  @OneToOne(() => StudentProfile, (profile) => profile.user)
  profile?: StudentProfile
}
