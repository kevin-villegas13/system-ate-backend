import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { omit } from 'lodash';
import { User } from './entities/user.entity';
import { Role } from '../role/entities/role.entity';
import { Conflict, NotFound } from '../common/exceptions';
import {
  ResponseList,
  SortOrder,
} from '../common/paginator/type/paginator.interface';
import { Response } from '../common/response/response.type';
import { Paginator } from '../common/paginator/paginator.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationUsersDto } from './dto/pagination-users.dto';
import { UserDto } from '../user/dto/user-omit-fields.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Response<null>> {
    const { username, password, roleName } = createUserDto;
    console.log(createUserDto);

    const [userExists, role] = await Promise.all([
      (await this.userRepository.count({ where: { username } })) > 0,
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

    await this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, {
        username,
        password: await argon2.hash(password),
        role,
      });
      await manager.save(user);
    });

    return {
      status: true,
      message: 'Cuenta creada con éxito.',
      data: null,
    };
  }

  async paginateUsers(
    paginationDto: PaginationUsersDto,
  ): Promise<ResponseList<UserDto>> {
    const {
      page,
      limit,
      search,
      order = SortOrder.ASC,
      roleId,
      status,
    } = paginationDto;

    const pageNum = Math.max(1, page);
    const limitNum = Math.max(1, limit);

    // Construcción dinámica del filtro "where"
    const where: FindOptionsWhere<User> = {
      ...(roleId && { role: { id: roleId } }),
      ...(status !== undefined ? { isActive: Boolean(status) } : {}),
      ...(search && { username: ILike(`%${search.toLocaleUpperCase()}%`) }),
    };

    // Obtención de los datos paginados
    const [data, count] = await this.userRepository.findAndCount({
      where,
      relations: ['role'],
      order: { username: order },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });

    // Formateo de los datos para eliminar campos sensibles
    const cleanData = data.map((user) => ({
      ...omit(user, ['createdAt', 'updatedAt', 'password']),
      role: user.role ? omit(user.role, ['id']) : undefined,
    }));

    return Paginator.Format(cleanData, count, pageNum, limitNum, search, order);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Response<null>> {
    const { username, password, roleName } = updateUserDto;

    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, {
        where: { id },
        relations: ['role'],
      });

      if (!user)
        throw new NotFound(
          'No se encontró el usuario. Verifica la información e intenta de nuevo.',
        );

      const [userExists, role] = await Promise.all([
        username && username !== user.username
          ? (await manager.count(User, { where: { username } })) > 0
          : false,
        roleName && roleName !== user.role.roleName
          ? manager.findOne(Role, { where: { roleName } })
          : null,
      ]);

      if (userExists)
        throw new Conflict(
          `El nombre de usuario "${username}" ya está registrado. Intenta con otro.`,
        );

      if (roleName && !role)
        throw new NotFound(
          `El rol "${roleName}" no está disponible. Verifica e intenta de nuevo.`,
        );

      Object.assign(user, {
        username: username || user.username,
        password: password ? await argon2.hash(password) : user.password,
        role: role || user.role,
      });

      await manager.save(user);

      return {
        status: true,
        message: 'Información actualizada correctamente.',
        data: null,
      };
    });
  }

  async toggleActiveStatus(id: string): Promise<Response<null>> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id } });
      if (!user) throw new NotFound('Usuario no encontrado.');

      user.isActive = !user.isActive;
      await manager.save(user);

      return {
        status: true,
        message: `El usuario ha sido ${user.isActive ? 'activado' : 'desactivado'} correctamente.`,
        data: null,
      };
    });
  }

  async remove(id: string): Promise<Response<null>> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id } });

      if (!user)
        throw new NotFound(
          'No se encontró el usuario. Verifica la información e intenta de nuevo.',
        );

      await manager.remove(user);

      return {
        status: true,
        message: 'El usuario ha sido eliminado correctamente.',
        data: null,
      };
    });
  }
}
