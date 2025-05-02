import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiResponse } from '../common/response/api-response';
import { PaginationUsersDto } from './dto/pagination-user.dto';
import { Paginator } from '../common/paginator/paginator';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<ApiResponse<void>> {
    const { username, password, role } = createUserDto;

    const hashedPassword = await argon2.hash(password);

    await this.prisma.user.create({
      data: {
        username,
        passwordHash: hashedPassword,
        role,
      },
    });

    return {
      message: 'Usuario creado exitosamente',
      data: null,
    };
  }

  async paginationUser(paginationDto: PaginationUsersDto) {
    const { page, limit, role, search } = paginationDto;

    const skip = (page - 1) * limit;

    const where: {
      role?: Role;
      username?: { contains: string; mode: 'insensitive' };
    } = {};

    if (role) where.role = role;
    if (search) where.username = { contains: search, mode: 'insensitive' };

    const users = await this.prisma.user.findMany({
      where,
      skip,
      take: limit,
    });

    const sanitizedUsers = users.map(({ passwordHash, ...rest }) => rest);
    const totalUsers = await this.prisma.user.count({ where });

    return Paginator.Format(sanitizedUsers, totalUsers, page, limit, search);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<void>> {
    const { isActive, password, confirmPassword, ...updateData } =
      updateUserDto;

    await this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        ...(password && { passwordHash: await argon2.hash(password) }),
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return {
      message: 'Usuario actualizado exitosamente',
      data: null,
    };
  }

  async toggleUserStatus(id: string): Promise<ApiResponse<void>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { isActive: true },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    return {
      message: `Usuario ${!user.isActive ? 'activado' : 'desactivado'} exitosamente`,
      data: null,
    };
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: 'Usuario eliminado exitosamente',
      data: null,
    };
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
