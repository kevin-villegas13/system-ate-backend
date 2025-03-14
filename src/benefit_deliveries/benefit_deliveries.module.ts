import { Module } from '@nestjs/common';
import { BenefitDeliveriesService } from './benefit_deliveries.service';
import { BenefitDeliveriesController } from './benefit_deliveries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitDistribution } from './entities/benefit_delivery.entity';
import { DeliveryStatus } from '../delivery/entities/delivery.entity';
import { RecipientType } from '../recipient/entities/recipient.entity';
import { DelegateBenefit } from '../delegate_assignments/entities/delegate-benefit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BenefitDistribution,
      DeliveryStatus,
      RecipientType,
      DelegateBenefit,
    ]),
  ],
  controllers: [BenefitDeliveriesController],
  providers: [BenefitDeliveriesService],
})
export class BenefitDeliveriesModule {}
