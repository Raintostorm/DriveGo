import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("subscription_plans")
export class SubscriptionPlan {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ type: "varchar", length: 32, unique: true })
  code!: string

  @Column({ name: "price_monthly", type: "numeric", precision: 12, scale: 2, default: 0 })
  priceMonthly!: string

  @Column({ type: "jsonb", default: [] })
  features!: string[]
}
