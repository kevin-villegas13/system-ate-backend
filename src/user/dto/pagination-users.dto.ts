import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { toInt } from '../../common/transformers/toInt';

export class PaginationUsersDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @Transform(toInt)
  roleId?: number;
}
