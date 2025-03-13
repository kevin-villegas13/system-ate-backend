import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class PaginationDelegateBenefitsDto extends PaginationDto {
  @IsOptional()
  @IsUUID('4', { message: 'El delegateId debe ser un UUID válido.' })
  delegateId?: string;
}
