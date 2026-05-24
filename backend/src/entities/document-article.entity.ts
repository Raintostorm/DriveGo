import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity("document_articles")
export class DocumentArticle {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ type: "varchar", length: 255, unique: true })
  slug!: string

  @Column({ type: "varchar", length: 255 })
  title!: string

  @Column({ type: "text", nullable: true })
  body?: string | null

  @Column({ type: "varchar", length: 64, nullable: true })
  category?: string | null

  @Column({ name: "pdf_url", type: "text", nullable: true })
  pdfUrl?: string | null

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date
}
