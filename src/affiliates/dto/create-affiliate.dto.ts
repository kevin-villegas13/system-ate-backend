import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAffiliateDto {
  @IsNotEmpty({
    message: 'El código de afiliado es obligatorio y no puede estar vacío.',
  })
  @IsString({ message: 'El código de afiliado debe ser un texto.' })
  affiliateCode: string;

  @IsNotEmpty({ message: 'El nombre del afiliado es obligatorio.' })
  @IsString({ message: 'El nombre del afiliado debe ser un texto.' })
  @MaxLength(200, {
    message:
      'El nombre del afiliado no puede ser más largo que 200 caracteres.',
  })
  name: string;

  @IsNotEmpty({ message: 'El DNI es obligatorio.' })
  @IsString({ message: 'El DNI debe ser un texto.' })
  @MaxLength(20, { message: 'El DNI no puede tener más de 20 caracteres.' })
  dni: string;

  @IsNotEmpty({ message: 'El ID de género es obligatorio.' })
  @IsNumber({}, { message: 'El ID de género debe ser un número.' })
  genderId: number;

  @IsEmail({}, { message: 'Por favor, ingresa un correo electrónico válido.' })
  @IsOptional()
  @MaxLength(100, {
    message: 'El correo electrónico no puede tener más de 100 caracteres.',
  })
  email?: string;

  @IsOptional()
  @MaxLength(100, {
    message: 'El campo de contacto no puede tener más de 100 caracteres.',
  })
  contact?: string;

  @IsNotEmpty({ message: 'El ID de sector es obligatorio.' })
  @IsNumber({}, { message: 'El ID de sector debe ser un número.' })
  sectorId: number;

  @IsOptional()
  @IsBoolean({
    message:
      'El campo "¿Tiene hijos?" debe ser un valor booleano (verdadero o falso).',
  })
  hasChildren?: boolean;

  @IsOptional()
  @IsBoolean({
    message:
      'El campo "¿Tiene discapacidad?" debe ser un valor booleano (verdadero o falso).',
  })
  hasDisability?: boolean;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe ser válida (YYYY-MM-DD).' },
  )
  birthdate?: Date;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto.' })
  @MaxLength(200, {
    message: 'La dirección no puede tener más de 200 caracteres.',
  })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Las notas deben ser un texto.' })
  @MaxLength(500, {
    message: 'Las notas no pueden ser más largas de 500 caracteres.',
  })
  note?: string;
}
