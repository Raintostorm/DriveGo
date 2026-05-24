import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { SubscriptionPlan } from "./subscription-plan.entity"
import { User } from "./user.entity"

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ name: "user_id", type: "uuid" })
  userId!: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User

  @Column({ name: "plan_id", type: "uuid", nullable: true })
  planId?: string | null

  @ManyToOne(() => SubscriptionPlan, { nullable: true })
  @JoinColumn({ name: "plan_id" })
  plan?: SubscriptionPlan | null

  @Column({ type: "numeric", precision: 12, scale: 2 })
  amount!: string

  @Column({ type: "varchar", length: 64, nullable: true })
  method?: string | null

  @Column({ type: "varchar", length: 32, default: "pending" })
  status!: string

  @Column({ name: "customer_info", type: "jsonb", nullable: true })
  customerInfo?: Record<string, unknown> | null

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date
}
