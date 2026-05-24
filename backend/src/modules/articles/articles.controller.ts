import { Controller, Get, Query } from "@nestjs/common"
import { dbNotConfigured } from "../../common/db-not-configured"

@Controller("articles")
export class ArticlesController {
  @Get()
  search(@Query("search") _search?: string) {
    dbNotConfigured("articles.search")
  }
}
