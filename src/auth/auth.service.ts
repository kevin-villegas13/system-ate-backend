import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginAuthDto } from './dto/login-auth.dto';
import { BadRequest, NotFound, NotImplemented } from 'src/common/exceptions';
import * as argon2 from 'argon2';
import { Token } from './interface/type-token';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly maxFailedAttempts: number;
  private readonly blockTime: number;

  private failedAttempts = new Map<
    string,
    { attempts: number; lastAttempt: number }
  >();

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this.maxFailedAttempts =
      this.configService.get<number>('auth.maxFailedAttempts') ?? 5;
    this.blockTime =
      this.configService.get<number>('auth.blockTime') ?? 5 * 60 * 1000;
  }

  async login(loginUserDto: LoginAuthDto, res: Response): Promise<void> {
    const { username, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });

    if (!user) throw new NotFound('No existe el usuario');

    const failedAttempts = this.failedAttempts.get(username);

    if (failedAttempts && failedAttempts.attempts >= this.maxFailedAttempts) {
      const timeSinceLastAttempt = Date.now() - failedAttempts.lastAttempt;
      if (timeSinceLastAttempt < this.blockTime) {
        throw new BadRequest(
          'Demasiados intentos fallidos, inténtalo más tarde.',
        );
      }
    }

    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) {
      this.failedAttempts.set(username, {
        attempts: (failedAttempts?.attempts ?? 0) + 1,
        lastAttempt: Date.now(),
      });
      throw new NotImplemented('La contraseña es incorrecta');
    }

    this.failedAttempts.delete(username);

    const payload = { id: user.id, role: user.role.roleName };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: '365d' }),
    ]);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).send({ message: 'Login exitoso' });
  }

  async refreshToken(refreshToken: string, res: Response): Promise<void> {
    let payload: Token;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }

    // Crear un nuevo access token con el mismo payload
    const accessToken = await this.jwtService.signAsync(
      {
        id: payload.id,
        role: payload.role,
      },
      { expiresIn: '15m' },
    );

    // Establecer el nuevo access token en la cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en HTTPS si es producción
      sameSite: 'lax',
    });

    // Enviar la respuesta con el mensaje de éxito
    res.status(200).send({ message: 'Access token actualizado' });
  }

  async logout(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.status(200).json({ message: 'Sesión cerrada correctamente' });
  }

  async getProfile(accessToken: string) {
    const decoded = this.jwtService.decode(accessToken);

    if (!decoded) throw new Error('Token inválido');

    const userId = decoded.id;

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['role'],
    });

    if (!user) throw new Error('Usuario no encontrado');

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
