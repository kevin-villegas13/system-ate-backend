import { Module } from '@nestjs/common';
import { BenefitDeliveriesService } from './benefit_deliveries.service';
import { BenefitDeliveriesController } from './benefit_deliveries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BenefitDistribution } from './entities/benefit_delivery.entity';
import { Delivery } from '../delivery/entities/delivery.entity';
import { Recipient } from '../recipient/entities/recipient.entity';
import { DelegateBenefit } from '../delegate_assignments/entities/delegate-benefit.entity';
import { Affiliate } from '../affiliates/entities/affiliate.entity';
import { Child } from '../children/entities/child.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BenefitDistribution,
      Delivery,
      Recipient,
      DelegateBenefit,
      Affiliate,
      Child,
    ]),
  ],
  controllers: [BenefitDeliveriesController],
  providers: [BenefitDeliveriesService],
})
export class BenefitDeliveriesModule {}
