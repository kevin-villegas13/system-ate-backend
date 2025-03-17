import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventStatus } from '../entities/enums/event-status.enum';
import { IsPastDate } from '../../common/validators/is-past-date';
import { IsNoSpaces } from '../../common/validators/is-no-spaces';
import { IsValidName } from '../../common/validators/is-valid-name';

export class CreateEventDto {
  @IsNotEmpty({ message: 'El nombre del evento es obligatorio.' })
  @IsString({ message: 'El nombre del evento debe ser un texto válido.' })
  @IsValidName({
    message:
      'El nombre solo puede contener letras, espacios y caracteres especiales.',
  })
  name: string;

  @IsNotEmpty({
    message: 'El tipo de evento es obligatorio.',
  })
  @IsNumber({}, { message: 'El tipo de evento debe ser un número.' })
  eventTypeId: number;

  @IsNotEmpty({
    message: 'La descripción del evento es obligatoria.',
  })
  @IsString({ message: 'La descripción debe ser un texto válido.' })
  @IsNoSpaces({
    message: 'La descripción no debe contener espacios en blanco.',
  })
  description: string;

  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria.' })
  @IsDateString({}, { message: 'Formato inválido. Usa YYYY-MM-DD.' })
  @IsPastDate({ message: 'La fecha de inicio no puede ser futura.' })
  startDate: string;

  @IsNotEmpty({ message: 'La fecha de fin es obligatoria.' })
  @IsDateString({}, { message: 'Formato inválido. Usa YYYY-MM-DD.' })
  @IsPastDate({ message: 'La fecha de fin no puede ser futura.' })
  endDate: string;

  @IsOptional()
  @IsEnum(EventStatus, {
    message:
      'El estado del evento debe ser "Activo", "Cancelado" o "Completado".',
  })
  status?: EventStatus;
}
