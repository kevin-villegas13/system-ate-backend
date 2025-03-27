import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { toInt } from '../../common/transformers/toInt';

export class PaginationAffiliatesDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @Transform(toInt)
  genderId?: number;

  @IsOptional()
  @IsInt()
  @Transform(toInt)
  sectorId?: number;
}
