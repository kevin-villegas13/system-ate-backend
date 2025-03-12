import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
} from 'class-validator';

export class CreateDelegateDto {
  @IsString({ message: 'Por favor, escribe el nombre.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @Length(1, 50, {
    message: 'El nombre debe tener entre 1 y 50 caracteres.',
  })
  firstName: string;

  @IsString({ message: 'Por favor, escribe el apellido.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @Length(1, 50, {
    message: 'El apellido debe tener entre 1 y 50 caracteres.',
  })
  lastName: string;

  @IsString({ message: 'Por favor, escribe el DNI.' })
  @IsNotEmpty({ message: 'El DNI es obligatorio.' })
  @Length(1, 20, {
    message: 'El DNI debe tener entre 1 y 20 caracteres.',
  })
  dni: string;

  @IsNotEmpty({ message: 'Por favor, selecciona un sector.' })
  @IsNumber({}, { message: 'El sector debe ser un número.' })
  sectorId: number;

  @IsBoolean({ message: 'El estado debe ser activo o inactivo.' })
  isActive?: boolean;
}
