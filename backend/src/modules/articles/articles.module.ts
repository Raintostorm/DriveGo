import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { DocumentArticle } from "../../entities/document-article.entity"
import { ArticlesController } from "./articles.controller"
import { ArticlesService } from "./articles.service"

@Module({
  imports: [TypeOrmModule.forFeature([DocumentArticle])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
