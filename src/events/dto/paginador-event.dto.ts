import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { toInt } from '../../common/transformers/toInt';

export class PaginationEventsDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @Transform(toInt)
  eventTypeId?: number;
}
