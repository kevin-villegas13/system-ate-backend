import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
