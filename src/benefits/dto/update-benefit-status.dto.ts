import { IsBoolean } from 'class-validator';

export class UpdateBenefitStatusDto {
  @IsBoolean({ message: 'El estado debe ser un valor booleano (true o false)' })
  isAvailable: boolean;
}
