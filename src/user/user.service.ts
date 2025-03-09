import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

    const existUsers = await this.userRepository.findOne({
      where: { username },
    });

    if (existUsers)
      throw new Conflict(`El nombre de usuario "${username}" ya está en uso.`);

    const role = await this.roleRepository.findOne({ where: { roleName } });

    if (!role) throw new NotFound(`El rol "${roleName}" no existe.`);

    const user = this.userRepository.create({
      username,
      password: await argon2.hash(password),
      role,
    });

    await this.userRepository.save(user);

    return {
      status: true,
      message: 'Empleado creado exitosamente',
      data: null,
    };
  }

  async getAllUsers(
    paginationDto: PaginationUsersDto,
  ): Promise<ResponseList<User>> {
    const {
      page,
      limit,
      search,
      order = SortOrder.ASC,
      roleId,
    } = paginationDto;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .select([
        'user.id',
        'user.username',
        'user.isActive',
        'user.createdAt',
        'user.updatedAt',
        'role.id',
        'role.roleName',
      ]);

    if (search)
      queryBuilder.andWhere('affiliate.affiliateName ILIKE :search', {
        search: `%${search}%`,
      });

    if (roleId) queryBuilder.andWhere('role.id = :roleId', { roleId });

    if (order === SortOrder.ASC || order === SortOrder.DESC)
      queryBuilder.orderBy(
        'user.username',
        order === SortOrder.ASC ? 'ASC' : 'DESC',
      );

    const [data, count] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return Paginator.Format(data, count, page, limit, search, order);
  }

  async findOne(id: string): Promise<Response<User>> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!user) throw new NotFound(`Usuario con ID "${id}" no encontrado.`);

    return {
      status: true,
      message: 'Usuario encontrado',
      data: user,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Response<User>> {
    const { username, password, roleName, isActive } = updateUserDto;

    const user = await this.findOne(id);
    if (!user.data) throw new NotFound('Usuario no encontrado');

    const updatedFields: Partial<User> = {};

    // Validar y actualizar el nombre de usuario
    if (username && username !== user.data.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username },
      });

      if (existingUser)
        throw new Conflict(
          `El nombre de usuario "${username}" ya está en uso.`,
        );

      updatedFields.username = username;
    }

    if (password) updatedFields.password = await argon2.hash(password);

    if (roleName) {
      const role = await this.roleRepository.findOne({ where: { roleName } });

      if (!role) throw new NotFound(`El rol "${roleName}" no existe.`);

      updatedFields.role = role;
    }

    if (typeof isActive !== 'undefined') updatedFields.isActive = isActive;

    const updatedUser = await this.userRepository.save({
      ...user.data,
      ...updatedFields,
    });

    return {
      status: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser,
    };
  }

  async deactivate(id: string): Promise<Response<User>> {
    const user = await this.findOne(id);

    if (!user.data) throw new NotFound(`Usuario con ID "${id}" no encontrado.`);

    user.data.isActive = false;

    const updatedUser = await this.userRepository.save(user.data);

    return {
      status: true,
      message: 'Usuario desactivado exitosamente',
      data: updatedUser,
    };
  }

  async remove(id: string): Promise<Response<null>> {
    const user = await this.findOne(id);

    if (!user.data) throw new NotFound(`Usuario con ID "${id}" no encontrado.`);

    await this.userRepository.remove(user.data);

    return {
      status: true,
      message: 'Usuario eliminado exitosamente',
      data: null,
    };
  }
}
