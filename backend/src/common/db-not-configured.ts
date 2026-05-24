import { HttpException, HttpStatus } from "@nestjs/common"

export function dbNotConfigured(feature: string) {
  throw new HttpException(
    {
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      message: "DB not configured",
      feature,
    },
    HttpStatus.SERVICE_UNAVAILABLE,
  )
}
