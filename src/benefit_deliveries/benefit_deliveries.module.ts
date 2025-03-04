import { Module } from '@nestjs/common';
import { BenefitDeliveriesService } from './benefit_deliveries.service';
import { BenefitDeliveriesController } from './benefit_deliveries.controller';

@Module({
  controllers: [BenefitDeliveriesController],
  providers: [BenefitDeliveriesService],
})
export class BenefitDeliveriesModule {}
