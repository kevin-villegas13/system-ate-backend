import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Delete,
  Query,
  Get,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Authorize } from '../common/decorators/authorize.decorator';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationUsersDto } from './dto/pagination-user.dto';

@Controller('users')
//@Authorize(Role.admin)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.usersService.create(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async pagination(@Query() paginationDto: PaginationUsersDto) {
    return await this.usersService.paginationUser(paginationDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.usersService.update(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/toggle-status')
  async deactivate(@Param('id') id: string) {
    return await this.usersService.toggleUserStatus(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
