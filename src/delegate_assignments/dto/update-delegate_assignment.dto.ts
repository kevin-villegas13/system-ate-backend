import { PartialType } from '@nestjs/mapped-types';
import { CreateDelegateAssignmentDto } from './create-delegate_assignment.dto';

export class UpdateDelegateAssignmentDto extends PartialType(CreateDelegateAssignmentDto) {}
