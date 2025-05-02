import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { toInt } from '../../../common/transformers/toInt';
import { toOptionalString } from '../../../common/transformers/toOptionalString';

export class PaginationDto {
  @IsInt()
  @Transform(toInt, { toClassOnly: true })
  @Min(1, { message: 'La página debe ser al menos 1.' })
  page: number;

  @IsInt()
  @Transform(toInt, { toClassOnly: true })
  @Min(1, { message: 'El límite debe ser al menos 1.' })
  limit: number;

  @IsOptional()
  @Transform(toOptionalString)
  @IsString({ message: 'El campo de búsqueda debe ser una cadena.' })
  search?: string;
}
