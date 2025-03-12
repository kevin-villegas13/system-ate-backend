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
import { DelegatesService } from './delegates.service';
import { CreateDelegateDto } from './dto/create-delegate.dto';
import { UpdateDelegateDto } from './dto/update-delegate.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { PaginationDelegatesDto } from './dto/paginador-delegatedto';
import { AuthDecorator } from 'src/common/decorators/jwt.decorator';

@Controller('delegates')
@AuthDecorator()
export class DelegatesController {
  constructor(private readonly delegatesService: DelegatesService) {}

  @Post()
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
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateDelegateDto: UpdateDelegateDto,
  ) {
    return this.delegatesService.update(id, updateDelegateDto);
  }

  @Patch(':id/desactive')
  @HttpCode(HttpStatus.OK)
  desactive(@Param('id') id: string) {
    return this.delegatesService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.delegatesService.remove(id);
  }
}
