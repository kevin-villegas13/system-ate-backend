import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(loginAuthDto:LoginAuthDto){
    const {username,password} = loginAuthDto
  }





}
