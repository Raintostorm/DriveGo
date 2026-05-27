import "reflect-metadata"
import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true })
  const config = app.get(ConfigService)
  const jwtSecret = config.get<string>("JWT_SECRET")?.trim()
  if (!jwtSecret || jwtSecret === "change-me" || jwtSecret.length < 16) {
    throw new Error(
      "JWT_SECRET must be configured with at least 16 characters (and cannot be 'change-me').",
    )
  }

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
