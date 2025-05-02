import { Role } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IsValidGeneralName } from '../../common/validators/is-valid-name';
import { IsEqualTo } from '../../common/transformers/is-equal-to';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsValidGeneralName()
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
        'La contraseña debe tener al menos 8 caracteres, 1 minúscula, 1 mayúscula y 1 símbolo',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEqualTo('password', {
    message: 'La confirmación de la contraseña no coincide',
  })
  confirmPassword: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
