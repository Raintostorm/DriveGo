import "reflect-metadata"
import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  app.setGlobalPrefix("api")
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.enableCors({
    origin: config.get<string>("CORS_ORIGIN", "http://localhost:5173"),
    credentials: true,
  })

  const port = Number(config.get<string>("PORT")) || 3000
  await app.listen(port)
}

bootstrap()
