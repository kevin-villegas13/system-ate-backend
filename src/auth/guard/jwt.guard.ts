import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookie(request);

    if (!token)
      throw new UnauthorizedException('Token de acceso no proporcionado');

    try {
      // Verificar el access token
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token de acceso inválido o expirado');
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies['access_token'];
  }
}
