import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  Min,
  IsUUID,
} from 'class-validator';
import { IsNoSpaces } from '../../common/validators/is-no-spaces';
import { IsValidCode } from '../../common/validators/is-valid-code';
import { IsValidName } from '../../common/validators/is-valid-name';
import { IsPastDate } from '../../common/validators/is-past-date';

export class CreateChildDto {
  @IsNotEmpty({ message: 'Por favor, ingresa el nombre del niño.' })
  @IsString({ message: 'El nombre debe ser un texto.' })
  @MaxLength(100, {
    message: 'El nombre no puede ser más largo de 100 caracteres.',
  })
  @IsValidName({
    message:
      'El nombre solo debe contener letras, espacios y caracteres especiales como tildes y apóstrofes.',
  })
  firstName: string;

  @IsNotEmpty({ message: 'Por favor, ingresa el apellido del niño.' })
  @IsString({ message: 'El apellido debe ser un texto.' })
  @MaxLength(100, {
    message: 'El apellido no puede ser más largo de 100 caracteres.',
  })
  @IsValidName({
    message:
      'El apellido solo debe contener letras, espacios y caracteres especiales como tildes y apóstrofes.',
  })
  lastName: string;

  @IsNotEmpty({
    message: 'Por favor, ingresa la fecha de nacimiento del niño.',
  })
  @IsDateString({}, { message: 'La fecha de nacimiento no es válida.' })
  @IsPastDate({
    message: 'La fecha de nacimiento no puede ser una fecha futura.',
  })
  birthDate: string;

  @IsOptional()
  @IsString({ message: 'La nota debe ser un texto.' })
  @MaxLength(500, {
    message: 'La nota no puede ser más larga de 500 caracteres.',
  })
  @IsNoSpaces({
    message: 'La nota no debe contener espacios en blanco.',
  })
  note?: string;

  @IsNotEmpty({ message: 'Por favor, ingresa el DNI del niño.' })
  @IsString({ message: 'El DNI debe ser un texto.' })
  @IsValidCode({ message: 'El DNI debe ser válido.' })
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
