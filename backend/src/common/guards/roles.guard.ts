import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ROLES_KEY } from "../decorators/roles.decorator"
import { AuthUser } from "../../modules/auth/jwt.strategy"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!required?.length) return true

    const request = context.switchToHttp().getRequest<{ user?: AuthUser }>()
    const user = request.user
    if (!user?.role || !required.includes(user.role)) {
      throw new ForbiddenException("Không có quyền truy cập")
    }
    return true
  }
}
