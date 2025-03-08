import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { Sector } from './entities/sector.entity';

@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllGenders(): Promise<Sector[]> {
    return this.sectorsService.getAllSectors();
  }
}
