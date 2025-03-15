import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
} from 'class-validator';
import { RoleEnum } from '../../role/entities/enum/role.enum';

export class CreateUserDto {
  @IsNotEmpty({
    message:
      'El nombre de usuario es obligatorio. Por favor, ingresa un nombre de usuario.',
  })
  @IsString({
    message: 'El nombre de usuario debe ser un texto, no números ni símbolos.',
  })
  @MaxLength(50, {
    message: 'El nombre de usuario no puede tener más de 50 caracteres.',
  })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü'’]+(?: [A-Za-zÁÉÍÓÚáéíóúÑñÜü'’]+)*$/, {
    message:
      'El nombre solo puede contener letras, espacios y caracteres especiales como tildes, diéresis y apóstrofes.',
  })
  username: string;

  @IsNotEmpty({
    message: 'La contraseña es obligatoria. Por favor, ingresa una contraseña.',
  })
  @IsString({ message: 'La contraseña debe ser un texto.' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
      minNumbers: 1,
    },
    {
      message:
        'La contraseña debe tener al menos 8 caracteres, una letra minúscula, una letra mayúscula, un número y un símbolo.',
    },
  )
  password: string;

  @IsNotEmpty({
    message:
      'El nombre del rol es obligatorio. Por favor, ingresa un nombre de rol válido.',
  })
  @IsEnum(RoleEnum, {
    message: `El rol debe ser uno de los siguientes valores: ${Object.values(RoleEnum).join(', ')}`,
  })
  roleName: RoleEnum;
}
