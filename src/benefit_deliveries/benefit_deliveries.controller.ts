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
import { BenefitDeliveriesService } from './benefit_deliveries.service';
import { CreateBenefitDeliveryDto } from './dto/create-benefit_delivery.dto';
import { UpdateBenefitDeliveryDto } from './dto/update-benefit_delivery.dto';
import { PaginationBenefitDeliveryDto } from './dto/paginador-benefit_delivery.dto';
import { Authorize } from '../common/decorators/authorize.decorator';
import { RoleEnum } from '../role/entities/enum/role.enum';

@Controller('benefit-deliveries')
export class BenefitDeliveriesController {
  constructor(
    private readonly benefitDeliveriesService: BenefitDeliveriesService,
  ) {}

  @Post()
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.CREATED)
  async createDistribution(@Body() dto: CreateBenefitDeliveryDto) {
    return this.benefitDeliveriesService.createDistribution(dto);
  }

  @Get()
  async paginateBenefitDistribution(
    @Query() dto: PaginationBenefitDeliveryDto,
  ) {
    return this.benefitDeliveriesService.paginateBenefitDistribution(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getDistributionById(@Param('id') id: string) {
    return this.benefitDeliveriesService.getDistributionById(id);
  }

  @Patch(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateDistribution(
    @Param('id') id: string,
    @Body() dto: UpdateBenefitDeliveryDto,
  ) {
    return this.benefitDeliveriesService.updateDistribution(id, dto);
  }

  @Delete(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteDistribution(@Param('id') id: string) {
    return this.benefitDeliveriesService.deleteDistribution(id);
  }
}
