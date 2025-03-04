import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BenefitDeliveriesService } from './benefit_deliveries.service';
import { CreateBenefitDeliveryDto } from './dto/create-benefit_delivery.dto';
import { UpdateBenefitDeliveryDto } from './dto/update-benefit_delivery.dto';

@Controller('benefit-deliveries')
export class BenefitDeliveriesController {
  constructor(private readonly benefitDeliveriesService: BenefitDeliveriesService) {}

  @Post()
  create(@Body() createBenefitDeliveryDto: CreateBenefitDeliveryDto) {
    return this.benefitDeliveriesService.create(createBenefitDeliveryDto);
  }

  @Get()
  findAll() {
    return this.benefitDeliveriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.benefitDeliveriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBenefitDeliveryDto: UpdateBenefitDeliveryDto) {
    return this.benefitDeliveriesService.update(+id, updateBenefitDeliveryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.benefitDeliveriesService.remove(+id);
  }
}
