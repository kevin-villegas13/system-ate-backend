import { IsInt, IsOptional, IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class PaginationBenefitsDto extends PaginationDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    const parsedValue = parseInt(value, 10);
    return isNaN(parsedValue) ? undefined : parsedValue;
  })
  type_id?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  is_available?: boolean;

  @IsOptional()
  @IsString()
  age_range?: string;
}
