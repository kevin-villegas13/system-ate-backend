import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { RoleEnum } from 'src/role/entities/enum/role.enum';

export const ROLES_KEY = 'roles';

export const Authorize = (...roles: RoleEnum[]) =>
  applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
  