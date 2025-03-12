import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class CreateBenefitDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'El tipo de beneficio es obligatorio' })
  typeId: number;

  @IsOptional()
  @MaxLength(50, {
    message: 'El rango de edad no puede superar los 50 caracteres',
  })
  ageRange?: string;

  @IsInt({ message: 'El stock debe ser un número entero' })
  @IsPositive({ message: 'El stock debe ser mayor o igual a 0' })
  stock: number;

  @IsOptional()
  @IsBoolean({ message: 'isAvailable debe ser un valor booleano' })
  isAvailable?: boolean;
}
