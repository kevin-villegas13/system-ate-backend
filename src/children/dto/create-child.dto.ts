import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsInt,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateChildDto {
  @IsNotEmpty({ message: 'Por favor, ingresa el nombre del niño.' })
  @IsString({ message: 'El nombre debe ser un texto.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(100, {
    message: 'El nombre no puede tener más de 100 caracteres.',
  })
  firstName: string;

  @IsNotEmpty({ message: 'Por favor, ingresa el apellido del niño.' })
  @IsString({ message: 'El apellido debe ser un texto.' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres.' })
  @MaxLength(100, {
    message: 'El apellido no puede tener más de 100 caracteres.',
  })
  lastName: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser válida.' })
  birthDate: string;

  @IsOptional()
  @IsString({ message: 'La nota debe ser un texto.' })
  @MaxLength(500, { message: 'La nota no puede tener más de 500 caracteres.' })
  note?: string;

  @IsNotEmpty({ message: 'Por favor, ingresa el DNI del niño.' })
  @IsString({ message: 'El DNI debe ser un texto.' })
  @Matches(/^\d{8}$/, {
    message: 'El DNI debe tener exactamente 8 caracteres numéricos.',
  })
  dni: string;

  @IsNotEmpty({ message: 'Por favor, selecciona el género del niño.' })
  @IsInt({ message: 'El género debe ser un número entero.' })
  @Min(1, { message: 'El género debe ser un número entero positivo.' })
  genderId: number;

  @IsNotEmpty({ message: 'Por favor, ingresa el identificador del afiliado.' })
  @IsUUID('all', {
    message: 'El identificador del afiliado debe ser un código único y válido.',
  })
  affiliateId: string;
}
