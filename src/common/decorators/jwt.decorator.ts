import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';

export const AuthDecorator = () => {
  return applyDecorators(UseGuards(JwtAuthGuard));
};
