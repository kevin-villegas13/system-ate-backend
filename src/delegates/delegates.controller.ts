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
  Put,
} from '@nestjs/common';
import { DelegatesService } from './delegates.service';
import { CreateDelegateDto } from './dto/create-delegate.dto';
import { UpdateDelegateDto } from './dto/update-delegate.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { PaginationDelegatesDto } from './dto/paginador-delegatedto';
import { UpdateDelegateStatusDto } from './dto/update-delegate-status.dto';
import { Authorize } from '../common/decorators/authorize.decorator';
import { RoleEnum } from '../role/entities/enum/role.enum';

@Controller('delegates')
export class DelegatesController {
  constructor(private readonly delegatesService: DelegatesService) {}

  @Post()
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDelegateDto: CreateDelegateDto, @GetUser() user: User) {
    return this.delegatesService.create(createDelegateDto, user?.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  paginateDelegates(@Query() paginationDto: PaginationDelegatesDto) {
    return this.delegatesService.paginateDelegates(paginationDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.delegatesService.findOne(id);
  }

  @Patch(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateDelegateDto: UpdateDelegateDto,
  ) {
    return this.delegatesService.update(id, updateDelegateDto);
  }

  @Put(':id/desactive')
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  desactive(@Param('id') id: string, @Body() dto: UpdateDelegateStatusDto) {
    return this.delegatesService.deactivate(id, dto);
  }

  @Delete(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.delegatesService.remove(id);
  }
}
