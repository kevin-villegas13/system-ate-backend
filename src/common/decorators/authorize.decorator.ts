import { UserRole } from '@prisma/client';
import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { AuthStrategy } from '../../auth/strategy/auth.strategy';
import { RefreshAuthStrategy } from '../../auth/strategy/refresh.strategy';

export const ROLES_KEY = 'roles';

export const Authorize = (...roles: UserRole[]) =>
  applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(ThrottlerGuard, AuthStrategy, RefreshAuthStrategy, RolesGuard),
  );
