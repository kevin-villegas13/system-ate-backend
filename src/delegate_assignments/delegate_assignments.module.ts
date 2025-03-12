import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DelegateAssignmentsService } from './delegate_assignments.service';
import { DelegateAssignmentsController } from './delegate_assignments.controller';
import { DelegateAssignment } from './entities/delegate_assignment.entity';
import { Delegate } from '../delegates/entities/delegate.entity';
import { Benefit } from '../benefits/entities/benefit.entity';
import { DelegateBenefit } from 'src/delegates/entities/delegate-benefit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Benefit,
      Delegate,
      DelegateBenefit,
      DelegateAssignment,
    ]),
  ],
  controllers: [DelegateAssignmentsController],
  providers: [DelegateAssignmentsService],
})
export class DelegateAssignmentsModule {}
