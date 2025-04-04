import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/authorize.decorator';
import { User } from '../../user/entities/user.entity';
import { RoleEnum } from '../../role/entities/enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.user as User;

    if (!user) return false;

    if (!user.role) return false;

    return requiredRoles.includes(user.role as unknown as RoleEnum);
  }
}
