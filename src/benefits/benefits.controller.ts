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
import { AssignBenefitDto } from './dto/assign-benefit.dto';
import { UpdateBenefitStatusDto } from './dto/update-benefit-status.dto';

@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBenefit(@Body() dto: CreateBenefitDto) {
    return this.benefitsService.create(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateBenefit(@Param('id') id: string, @Body() dto: UpdateBenefitDto) {
    return this.benefitsService.updateBenefit(id, dto);
  }

  @Post('assign')
  @HttpCode(HttpStatus.CREATED)
  assignBenefit(@Body() dto: AssignBenefitDto) {
    return this.benefitsService.assignBenefitToDelegate(dto);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBenefitStatusDto) {
    return this.benefitsService.updateBenefitStatus(id, dto);
  }
}
