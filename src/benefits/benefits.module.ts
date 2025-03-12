import { Module } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Benefit } from './entities/benefit.entity';
import { BenefitType } from './entities/benefit-types.entity';
import { DelegateBenefit } from 'src/delegates/entities/delegate-benefit.entity';
import { Delegate } from 'src/delegates/entities/delegate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Benefit, BenefitType, DelegateBenefit, Delegate]),
  ],
  controllers: [BenefitsController],
  providers: [BenefitsService],
})
export class BenefitsModule {}
