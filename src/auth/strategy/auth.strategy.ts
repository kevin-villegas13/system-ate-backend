import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { TokenPayload } from '../interface/token-payload.interface';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          if (request?.headers?.authorization) {
            const auth = request.headers.authorization;
            return auth.startsWith('Bearer') ? auth.slice(7) : auth;
          }
          return request?.cookies?.token || null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_ACCESS_TOKEN_SECRET',
      ) as string,
    });
  }

  async validate(token: TokenPayload) {
    return await this.userService.getUserById(token.sub);
  }
}
