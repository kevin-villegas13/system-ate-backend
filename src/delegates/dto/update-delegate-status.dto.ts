import { IsBoolean } from 'class-validator';

export class UpdateDelegateStatusDto {
  @IsBoolean({ message: 'El estado debe ser un valor booleano (true o false)' })
  is_active: boolean;
}
