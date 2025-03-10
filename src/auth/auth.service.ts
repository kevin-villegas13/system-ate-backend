import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginAuthDto } from './dto/login-auth.dto';
import { BadRequest, NotFound, NotImplemented } from 'src/common/exceptions';
import * as argon2 from 'argon2';
import { Tokens } from './interface/type-token';

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

  async login(loginUserDto: LoginAuthDto): Promise<Tokens> {
    const { username, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });

    if (!user) throw new NotFound('No existe el usuario');

    const failedAttempts = this.failedAttempts.get(username);

    if (failedAttempts && failedAttempts.attempts >= this.maxFailedAttempts) {
      const timeSinceLastAttempt = Date.now() - failedAttempts.lastAttempt;

      if (timeSinceLastAttempt < this.blockTime)
        throw new BadRequest(
          'Demasiados intentos fallidos, inténtalo más tarde.',
        );
    }

    const passwordMatch = await argon2.verify(user.password, password);

    if (!passwordMatch) {
      const attempts = (failedAttempts?.attempts ?? 0) + 1;
      this.failedAttempts.set(username, { attempts, lastAttempt: Date.now() });
      throw new NotImplemented('La contraseña es incorrecta');
    }

    this.failedAttempts.delete(username);

    return {
      accessToken: await this.jwtService.signAsync({
        id: user.id,
        name: user.username,
        role: user.role.roleName,
      }),
    };
  }
}
