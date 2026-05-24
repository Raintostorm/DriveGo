import { Controller, Get, Param, Query } from "@nestjs/common"
import { ArticlesService } from "./articles.service"

@Controller("articles")
export class ArticlesController {
  constructor(private readonly service: ArticlesService) {}

  @Get()
  search(@Query("search") search?: string) {
    return this.service.search(search)
  }

  @Get(":slug")
  getBySlug(@Param("slug") slug: string) {
    return this.service.getBySlug(slug)
  }
}
