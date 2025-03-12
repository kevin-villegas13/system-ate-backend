import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DelegateAssignmentsService } from './delegate_assignments.service';
import { AssignBenefitDto } from './dto/assign-benefit.dto';
import { UpdateDelegateAssignmentDto } from './dto/update-delegate_assignment.dto';

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

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateAssignment(
    @Param('id') id: number,
    @Body() dto: UpdateDelegateAssignmentDto,
  ) {
    return this.delegateAssignmentsService.updateAssignment(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteAssignment(@Param('id') id: number) {
    return this.delegateAssignmentsService.deleteAssignment(id);
  }
}
