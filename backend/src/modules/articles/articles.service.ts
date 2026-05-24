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

  async search(search?: string) {
    const where = search
      ? [
          { title: ILike(`%${search}%`) },
          { body: ILike(`%${search}%`) },
          { category: ILike(`%${search}%`) },
        ]
      : undefined

    const rows = await this.repo.find({
      where,
      order: { updatedAt: "DESC" },
    })

    return rows.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      body: a.body,
      category: a.category,
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
