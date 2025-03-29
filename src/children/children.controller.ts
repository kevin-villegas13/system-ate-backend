import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import { PaginationChildrenDto } from './dto/paginador-children.dto';
import { Authorize } from '../common/decorators/authorize.decorator';
import { RoleEnum } from '../role/entities/enum/role.enum';

@Controller('children')
@Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Post()
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateChildDto) {
    return this.childrenService.create(dto);
  }

  @Get()
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  async paginateChildren(@Query() dto: PaginationChildrenDto) {
    return this.childrenService.paginateChildren(dto);
  }

  @Get(':id')
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  async findChildById(@Param('id') id: string) {
    return this.childrenService.findChildById(id);
  }

  @Get('affiliate/:affiliateId')
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  async findChildrenByAffiliateId(@Param('affiliateId') affiliateId: string) {
    return this.childrenService.findChildrenByAffiliateId(affiliateId);
  }

  @Patch(':id')
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateChildDto) {
    return this.childrenService.update(id, dto);
  }

  @Delete(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.childrenService.remove(id);
  }
}
