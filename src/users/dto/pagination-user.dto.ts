import { IsEnum, IsOptional } from 'class-validator';
import { Role } from '@prisma/client';
import { PaginationDto } from '../../common/paginator/dto/pagination.dto';
import { toOptionalString } from '../../common/transformers/toOptionalString';
import { Transform } from 'class-transformer';

export class PaginationUsersDto extends PaginationDto {
  @IsOptional()
  @IsEnum(Role)
  @Transform(toOptionalString)
  role?: Role;
}
