import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
} from 'class-validator';

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
  @Matches(/^[a-zA-Z]+$/, {
    message:
      'El nombre de usuario solo puede contener letras, sin números ni símbolos.',
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
      'El nombre del rol es obligatorio. Por favor, ingresa el nombre del rol.',
  })
  @IsString({
    message: 'El nombre del rol debe ser un texto, no números ni símbolos.',
  })
  @MaxLength(50, {
    message: 'El nombre del rol no puede tener más de 50 caracteres.',
  })
  @Matches(/^[a-zA-Z]+$/, {
    message:
      'El nombre del rol solo puede contener letras, sin números ni símbolos.',
  })
  roleName: string;
}
