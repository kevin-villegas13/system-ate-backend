import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  @IsString()
  username: string;

  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 1,
    },
    {
      message:
        'La contraseña debe tener al menos 8 caracteres, 1 minúscula, 1 mayúscula y 1 símbolo',
    },
  )
  password: string;
}
