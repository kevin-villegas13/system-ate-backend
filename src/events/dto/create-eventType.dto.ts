import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidName } from '../../common/validators/is-valid-name';

export class CreateEventTypeDto {
  @IsNotEmpty({
    message: 'Por favor, ingresa un nombre para el tipo de evento.',
  })
  @IsString({ message: 'El nombre debe contener solo letras.' })
  @IsValidName({
    message:
      'El nombre solo puede contener letras, espacios y caracteres especiales.',
  })
  typeName: string;
}
