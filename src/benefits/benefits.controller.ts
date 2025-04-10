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
  Query,
} from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { UpdateBenefitStatusDto } from './dto/update-benefit-status.dto';
import { CreateBenefitTypeDto } from './dto/create-benefit-type.dto';
import { PaginationBenefitsDto } from './dto/paginador-benefits.dto';
import { Authorize } from '../common/decorators/authorize.decorator';
import { RoleEnum } from '../role/entities/enum/role.enum';

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

  @Get()
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  paginateDelegates(@Query() dto: PaginationBenefitsDto) {
    return this.benefitsService.paginateBenefits(dto);
  }

  @Get(':id')
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  findOneBenefit(@Param('id') id: string) {
    return this.benefitsService.findOneBenefit(id);
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
