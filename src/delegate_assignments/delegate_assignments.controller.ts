import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DelegateAssignmentsService } from './delegate_assignments.service';
import { AssignBenefitDto } from './dto/assign-benefit.dto';

@Controller('delegate-assignments')
export class DelegateAssignmentsController {
  constructor(
    private readonly delegateAssignmentsService: DelegateAssignmentsService,
  ) {}

  @Post('assign')
  @HttpCode(HttpStatus.CREATED)
  assignBenefit(@Body() dto: AssignBenefitDto) {
    return this.delegateAssignmentsService.assignBenefitToDelegate(dto);
  }
}
