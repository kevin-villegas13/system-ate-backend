import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DelegateAssignmentsService } from './delegate_assignments.service';
import { DelegateAssignmentsController } from './delegate_assignments.controller';
import { Delegate } from '../delegates/entities/delegate.entity';
import { Benefit } from '../benefits/entities/benefit.entity';
import { DelegateBenefit } from '../delegate_assignments/entities/delegate-benefit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Benefit, Delegate, DelegateBenefit])],
  controllers: [DelegateAssignmentsController],
  providers: [DelegateAssignmentsService],
})
export class DelegateAssignmentsModule {}
