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
import { BenefitsService } from './benefits.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { UpdateBenefitStatusDto } from './dto/update-benefit-status.dto';
import { CreateBenefitTypeDto } from './dto/create-benefit-type.dto';

@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBenefit(@Body() dto: CreateBenefitDto) {
    return this.benefitsService.create(dto);
  }

  @Post('types')
  @HttpCode(HttpStatus.CREATED)
  async createBenefitType(@Body() dto: CreateBenefitTypeDto) {
    return this.benefitsService.createBenefitType(dto);
  }

  


  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateBenefit(@Param('id') id: string, @Body() dto: UpdateBenefitDto) {
    return this.benefitsService.updateBenefit(id, dto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBenefitStatusDto) {
    return this.benefitsService.updateBenefitStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteBenefit(@Param('id') id: string) {
    return this.benefitsService.deleteBenefit(id);
  }
}
