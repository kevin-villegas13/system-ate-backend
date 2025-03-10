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

@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createChildDto: CreateChildDto) {
    return this.childrenService.create(createChildDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAffiliates(@Query() paginationDto: PaginationChildrenDto) {
    return this.childrenService.getAllChildrenPaginated(paginationDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findByAffiliateId(@Param('id') id: string) {
    return this.childrenService.findByAffiliateId(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateChildDto: UpdateChildDto,
  ) {
    return this.childrenService.update(id, updateChildDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.childrenService.remove(id);
  }
}
