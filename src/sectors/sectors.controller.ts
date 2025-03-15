import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { RoleEnum } from '../role/entities/enum/role.enum';
import { Authorize } from '../common/decorators/authorize.decorator';

@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Post()
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSectorDto: CreateSectorDto) {
    return this.sectorsService.create(createSectorDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllSectors() {
    return this.sectorsService.getAllSectors();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    return this.sectorsService.findOne(id);
  }

  @Patch(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() updateSectorDto: UpdateSectorDto,
  ) {
    return this.sectorsService.update(id, updateSectorDto);
  }

  @Delete(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    return this.sectorsService.remove(id);
  }
}
