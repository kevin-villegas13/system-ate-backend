import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class PaginationDelegatesDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    const parsedValue = parseInt(value, 10);
    return isNaN(parsedValue) ? undefined : parsedValue;
  })
  sectorId?: number;
}
