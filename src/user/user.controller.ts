import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationUsersDto } from './dto/pagination-users.dto';
import { Authorize } from 'src/common/decorators/authorize.decorator';
import { RoleEnum } from '../role/entities/enum/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() dto: PaginationUsersDto) {
    return this.userService.paginateUsers(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Patch(':id/toggle-status')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async toggleStatus(@Param('id') id: string) {
    return this.userService.toggleActiveStatus(id);
  }

  @Delete(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
