import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import argon2 from 'argon2';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto, res: Response) {
    const { username, password } = loginAuthDto;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) throw new NotFoundException('User not found');

    const isPasswordValid = await argon2.verify(user.passwordHash, password);

    if (!isPasswordValid) throw new NotFoundException('Invalid password');

    const payload = { sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { message: 'Login successful' };
  }

  async refreshToken(refresh_token: string, res: Response) {
    const refreshToken = refresh_token;

    if (!refreshToken) throw new NotFoundException('Refresh token not found');

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });

    const newAccessToken = await this.jwtService.signAsync(
      { sub: payload.sub },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: '15m',
      },
    );

    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 15,
    });

    return { message: 'Token refreshed successfully' };
  }

  async logout(res: Response) {
    res.clearCookie('token');
    res.clearCookie('refresh_token');
    return { message: 'Logout successful' };
  }
}
