import { ExecutionContext, Injectable } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

/** Attaches `req.user` when Bearer token is valid; otherwise leaves user unset. */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<{ headers: { authorization?: string } }>()
    if (!request.headers.authorization) {
      return true
    }
    return super.canActivate(context) as boolean | Promise<boolean>
  }

  handleRequest<TUser>(_err: unknown, user: TUser): TUser | null {
    return user ?? null
  }
}
