import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { GendersService } from './genders.service';
import { Gender } from './entities/gender.entity';

@Controller('genders')
export class GendersController {
  constructor(private readonly gendersService: GendersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllGenders(): Promise<Gender[]> {
    return this.gendersService.getAllGenders();
  }
}
