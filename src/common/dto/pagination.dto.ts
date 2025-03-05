import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { SortOrder } from '../paginator/type/paginator.interface';

export class PaginationDto {
  @IsInt()
  @Min(1, { message: 'La página debe ser al menos 1.' })
  page: number;

  @IsInt()
  @Min(1, { message: 'El límite debe ser al menos 1.' })
  limit: number;

  @IsOptional()
  @IsString({ message: 'El campo de búsqueda debe ser una cadena.' })
  search?: string;

  @IsOptional()
  @IsEnum(SortOrder, { message: 'El orden debe ser ASC o DESC.' })
  order?: SortOrder = SortOrder.ASC;
}
