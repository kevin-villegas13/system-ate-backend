import { Injectable } from '@nestjs/common';
import { CreateDelegateAssignmentDto } from './dto/create-delegate_assignment.dto';
import { UpdateDelegateAssignmentDto } from './dto/update-delegate_assignment.dto';

@Injectable()
export class DelegateAssignmentsService {
  create(createDelegateAssignmentDto: CreateDelegateAssignmentDto) {
    return 'This action adds a new delegateAssignment';
  }

  findAll() {
    return `This action returns all delegateAssignments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} delegateAssignment`;
  }

  update(id: number, updateDelegateAssignmentDto: UpdateDelegateAssignmentDto) {
    return `This action updates a #${id} delegateAssignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} delegateAssignment`;
  }
}
