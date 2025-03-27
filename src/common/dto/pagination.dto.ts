import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortOrder } from '../paginator/type/paginator.interface';
import { toInt } from '../transformers/toInt';
import { toOptionalString } from '../transformers/toOptionalString';

export class PaginationDto {
  @IsInt()
  @Min(1, { message: 'La página debe ser al menos 1.' })
  @Transform(toInt, { toClassOnly: true })
  page: number;

  @IsInt()
  @Transform(toInt, { toClassOnly: true })
  limit: number;

  @IsOptional()
  @IsString({ message: 'El campo de búsqueda debe ser una cadena.' })
  @Transform(toOptionalString)
  search?: string;

  @IsOptional()
  @IsEnum(SortOrder, { message: 'El orden debe ser ASC o DESC.' })
  @Transform(toOptionalString)
  order: SortOrder = SortOrder.ASC;
}
