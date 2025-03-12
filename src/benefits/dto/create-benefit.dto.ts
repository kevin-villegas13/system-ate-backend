import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class CreateBenefitDto {
  @IsNotEmpty({ message: 'Por favor, ingresa un nombre para el beneficio.' })
  @MaxLength(100, {
    message: 'El nombre no puede ser más largo de 100 caracteres.',
  })
  name: string;

  @IsNotEmpty({ message: 'El tipo de beneficio es necesario.' })
  typeId: number;

  @IsOptional()
  @MaxLength(50, {
    message: 'El rango de edad no puede superar los 50 caracteres',
  })
  ageRange?: string;

  @IsInt({ message: 'El stock debe ser un número entero.' })
  @IsPositive({ message: 'El stock debe ser un número positivo.' })
  stock: number;

  @IsOptional()
  @IsBoolean({ message: 'isAvailable debe ser un valor booleano.' })
  isAvailable?: boolean;

  @IsOptional()
  @MaxLength(200, {
    message: 'La descripción no puede superar los 200 caracteres.',
  })
  description?: string;
}
