import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DelegateAssignmentsService } from './delegate_assignments.service';
import { AssignBenefitDto } from './dto/assign-benefit.dto';
import { UpdateDelegateAssignmentDto } from './dto/update-delegate_assignment.dto';
import { PaginationDelegateBenefitsDto } from './dto/pagination-delegate_assignments.dto';
import { RoleEnum } from '../role/entities/enum/role.enum';
import { Authorize } from '../common/decorators/authorize.decorator';

@Controller('delegate-assignments')
export class DelegateAssignmentsController {
  constructor(
    private readonly delegateAssignmentsService: DelegateAssignmentsService,
  ) {}

  @Post('assign')
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.CREATED)
  assignBenefit(@Body() dto: AssignBenefitDto) {
    return this.delegateAssignmentsService.assignBenefitToDelegate(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getHistoryByDelegate(@Query() dto: PaginationDelegateBenefitsDto) {
    return this.delegateAssignmentsService.getHistoryByDelegate(dto);
  }

  @Put(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateAssignment(
    @Param('id') id: number,
    @Body() dto: UpdateDelegateAssignmentDto,
  ) {
    return this.delegateAssignmentsService.updateAssignment(id, dto);
  }

  @Delete(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteAssignment(@Param('id') id: number) {
    return this.delegateAssignmentsService.deleteAssignment(id);
  }
}
