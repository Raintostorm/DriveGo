import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

export type JwtPayload = {
  sub: string
  email: string
  role: string
}

export type AuthUser = {
  userId: string
  email: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>("JWT_SECRET")?.trim()
    if (!secret) {
      throw new Error("Missing JWT_SECRET in environment")
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    })
  }

  validate(payload: JwtPayload): AuthUser {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    }
  }
}
