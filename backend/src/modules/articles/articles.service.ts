import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { ILike, Repository } from "typeorm"
import { DocumentArticle } from "../../entities/document-article.entity"

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(DocumentArticle)
    private readonly repo: Repository<DocumentArticle>,
  ) {}

  async search(search?: string, licenseClass?: string) {
    const qb = this.repo.createQueryBuilder("a").orderBy("a.updated_at", "DESC")

    if (licenseClass) {
      qb.andWhere("(a.license_class IS NULL OR a.license_class = :licenseClass)", {
        licenseClass,
      })
    }

    if (search?.trim()) {
      const q = `%${search.trim()}%`
      qb.andWhere(
        "(a.title ILIKE :q OR a.body ILIKE :q OR a.category ILIKE :q)",
        { q },
      )
    }

    const rows = await qb.getMany()

    return rows.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      body: a.body,
      category: a.category,
      licenseClass: a.licenseClass ?? null,
      updatedAt: a.updatedAt,
    }))
  }

  async getBySlug(slug: string) {
    const article = await this.repo.findOne({ where: { slug } })
    if (!article) throw new NotFoundException("Không tìm thấy bài viết")
    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      body: article.body,
      category: article.category,
      updatedAt: article.updatedAt,
    }
  }
}
