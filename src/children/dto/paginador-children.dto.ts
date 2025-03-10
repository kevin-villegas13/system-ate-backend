import { IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Transform } from 'class-transformer';

export class PaginationChildrenDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    const parsedValue = parseInt(value, 10);
    return isNaN(parsedValue) ? undefined : parsedValue;
  })
  genderId?: number;
}
