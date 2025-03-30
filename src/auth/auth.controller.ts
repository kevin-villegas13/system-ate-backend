import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { Body, Controller, Delete, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Cookies } from '../common/decorators/cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async loginOrRefresh(@Body() dto: LoginAuthDto, @Res() res: Response) {
    return this.authService.login(dto, res);
  }

  @Get('refresh-token')
  async refreshToken(
    @Cookies('refresh_token') refreshToken: string,
    @Res() res: Response,
  ) {
    return this.authService.refreshToken(refreshToken, res);
  }

  @Delete('logout')
  async logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
