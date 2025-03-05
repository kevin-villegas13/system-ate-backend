import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginAuthDto } from './dto/login-auth.dto';
import { NotFound, NotImplemented } from 'src/common/exceptions';
import * as argon2 from 'argon2';
import { Tokens } from './interface/type-token';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async login(loginUserDto: LoginAuthDto): Promise<Tokens> {
    const { username, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!user) throw new NotFound('User not found');

    const passwordMatch = await argon2.verify(user.password, password);

    if (!passwordMatch) throw new NotImplemented('The password is incorrect');

    return {
      accessToken: await this.jwtService.signAsync({
        id: user.id,
      }),
    };
  }
}
