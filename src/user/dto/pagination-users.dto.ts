import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { toInt } from '../../common/transformers/toInt';

export class PaginationUsersDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @Transform(toInt)
  roleId?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : undefined,
  )
  status?: boolean;
}
