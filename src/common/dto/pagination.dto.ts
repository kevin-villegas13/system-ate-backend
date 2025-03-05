import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortOrder } from '../paginator/type/paginator.interface';

export class PaginationDto {
  @IsInt()
  @Min(1, { message: 'La página debe ser al menos 1.' })
  @Transform(({ value }) => (value ? parseInt(value, 10) : value), {
    toClassOnly: true,
  })
  page: number;

  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value, 10) : value), {
    toClassOnly: true,
  })
  limit: number;

  @IsOptional()
  @IsString({ message: 'El campo de búsqueda debe ser una cadena.' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  search?: string;

  @IsOptional()
  @IsEnum(SortOrder, { message: 'El orden debe ser ASC o DESC.' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  order?: SortOrder = SortOrder.ASC;
}
