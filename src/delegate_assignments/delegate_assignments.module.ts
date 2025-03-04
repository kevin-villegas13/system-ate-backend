import { Module } from '@nestjs/common';
import { DelegateAssignmentsService } from './delegate_assignments.service';
import { DelegateAssignmentsController } from './delegate_assignments.controller';

@Module({
  controllers: [DelegateAssignmentsController],
  providers: [DelegateAssignmentsService],
})
export class DelegateAssignmentsModule {}
