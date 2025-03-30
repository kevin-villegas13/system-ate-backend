import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { IsValidName } from '../../common/validators/is-valid-name';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsString()
  @IsValidName({
    message: 'El nombre solo puede contener letras y espacios.',
  })
  username: string;

  @IsNotEmpty()
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
        'La contraseña debe tener al menos 8 caracteres e incluir una letra mayúscula, una minúscula y un símbolo (como @, #, $).',
    },
  )
  password: string;
}
