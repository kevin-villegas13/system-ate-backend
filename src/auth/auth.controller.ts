import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Cookies } from 'src/common/decorators/cookies.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginAuthDto, @Res() res: Response) {
    return await this.authService.login(dto, res);
  }

  @Post('refresh')
  async refreshToken(
    @Cookies('refresh_token') refreshToken: string,
    @Res() res: Response,
  ) {
    return await this.authService.refreshToken(refreshToken, res);
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return await this.authService.logout(res);
  }
}
