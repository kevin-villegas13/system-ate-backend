import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Response } from '../common/response/response.type';
import { CreateUserDto } from './dto/create-user.dto';
import { Conflict, NotFound } from '../common/exceptions';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationUsersDto } from './dto/pagination-users.dto';
import {
  ResponseList,
  SortOrder,
} from '../common/paginator/type/paginator.interface';
import { Paginator } from '../common/paginator/paginator.helper';
import { omit } from 'lodash';
import { SafeUser } from './interfaces/safe-users.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Response<null>> {
    const { username, password, roleName } = createUserDto;

    const [userExists, role] = await Promise.all([
      this.userRepository.exists({ where: { username } }),
      this.roleRepository.findOne({ where: { roleName } }),
    ]);

    if (userExists)
      throw new Conflict(
        `El nombre de usuario "${username}" ya está registrado. Intenta con otro.`,
      );

    if (!role)
      throw new NotFound(
        `El rol "${roleName}" no está disponible. Verifica e intenta de nuevo.`,
      );

    await this.userRepository.manager.transaction(async (entityManager) => {
      const user = entityManager.create(User, {
        username,
        password: await argon2.hash(password),
        role,
      });
      await entityManager.save(user);
    });

    return {
      status: true,
      message: 'Cuenta creada con éxito.',
      data: null,
    };
  }

  async paginateUsers(
    paginationDto: PaginationUsersDto,
  ): Promise<ResponseList<SafeUser>> {
    const {
      page,
      limit,
      search,
      order = SortOrder.ASC,
      roleId,
    } = paginationDto;

    const currentPage = Math.max(1, page);
    const currentLimit = Math.max(1, limit);

    const where: FindOptionsWhere<User> = {
      ...(roleId && { role: { id: roleId } }),
      ...(search && {
        username: ILike(`%${search}%`),
      }),
    };

    const [data, count] = await this.userRepository.findAndCount({
      where,
      relations: ['role'],
      order: { username: order },
      skip: (currentPage - 1) * currentLimit,
      take: currentLimit,
    });

    const cleanData = data.map((user) => ({
      ...omit(user, ['createdAt', 'updatedAt', 'password']),
      role: user.role ? omit(user.role, ['id']) : undefined,
    }));

    return Paginator.Format(
      cleanData,
      count,
      currentPage,
      currentLimit,
      search,
      order,
    );
  }

  async findOne(id: string): Promise<Response<SafeUser>> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user)
      throw new NotFound(
        `No se encontró ninguna cuenta con la información proporcionada.`,
      );

    const cleanUser = {
      ...omit(user, ['createdAt', 'updatedAt', 'password']),
      role: user.role ? omit(user.role, ['id']) : undefined,
    };

    return {
      status: true,
      message: 'Cuenta encontrada exitosamente.',
      data: cleanUser,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Response<null>> {
    const { username, password, roleName, isActive } = updateUserDto;

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user)
      throw new NotFound(
        'No se encontró el usuario. Verifica la información e intenta de nuevo.',
      );

    if (username && username !== user.username) {
      const userExists = await this.userRepository.exist({
        where: { username },
      });

      if (userExists)
        throw new Conflict(
          `El nombre de usuario "${username}" ya está registrado. Intenta con otro.`,
        );

      user.username = username;
    }

    if (password) user.password = await argon2.hash(password);

    if (roleName && roleName !== user.role.roleName) {
      const role = await this.roleRepository.findOne({ where: { roleName } });
      if (!role)
        throw new NotFound(
          `El rol "${roleName}" no está disponible. Verifica e intenta de nuevo.`,
        );
      user.role = role;
    }

    if (typeof isActive !== 'undefined') user.isActive = isActive;

    const updatedUser = await this.userRepository.save(user);

    return {
      status: true,
      message: 'Información actualizada correctamente.',
      data: null,
    };
  }

  async toggleActiveStatus(id: string): Promise<Response<null>> {
    const user = await this.findOne(id);
    if (!user.data)
      throw new NotFound(
        'No se encontró el usuario. Verifica la información e intenta de nuevo.',
      );

    user.data.isActive = !user.data.isActive;
    await this.userRepository.save(user.data);

    return {
      status: true,
      message: `El usuario ha sido ${user.data.isActive ? 'activado' : 'desactivado'} correctamente.`,
      data: null,
    };
  }

  async remove(id: string): Promise<Response<null>> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user)
      throw new NotFound(
        'No se encontró el usuario. Verifica la información e intenta de nuevo.',
      );

    await this.userRepository.remove(user);

    return {
      status: true,
      message: 'El usuario ha sido eliminado correctamente.',
      data: null,
    };
  }
}
