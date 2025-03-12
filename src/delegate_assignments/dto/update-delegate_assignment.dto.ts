import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdateDelegateAssignmentDto {
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'La cantidad debe ser al menos 1.' })
  quantity?: number;
}
