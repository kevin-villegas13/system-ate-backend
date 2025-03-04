import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DelegateAssignmentsService } from './delegate_assignments.service';
import { CreateDelegateAssignmentDto } from './dto/create-delegate_assignment.dto';
import { UpdateDelegateAssignmentDto } from './dto/update-delegate_assignment.dto';

@Controller('delegate-assignments')
export class DelegateAssignmentsController {
  constructor(private readonly delegateAssignmentsService: DelegateAssignmentsService) {}

  @Post()
  create(@Body() createDelegateAssignmentDto: CreateDelegateAssignmentDto) {
    return this.delegateAssignmentsService.create(createDelegateAssignmentDto);
  }

  @Get()
  findAll() {
    return this.delegateAssignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.delegateAssignmentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDelegateAssignmentDto: UpdateDelegateAssignmentDto) {
    return this.delegateAssignmentsService.update(+id, updateDelegateAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.delegateAssignmentsService.remove(+id);
  }
}
