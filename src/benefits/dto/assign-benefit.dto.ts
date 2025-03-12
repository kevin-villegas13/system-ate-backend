import { IsUUID, IsInt, Min } from 'class-validator';

export class AssignBenefitDto {
  @IsUUID('4', { message: 'Selecciona un beneficio válido' })
  benefitId: string;

  @IsUUID('4', { message: 'Selecciona un delegado válido' })
  delegateId: string;

  @IsInt({ message: 'La cantidad debe ser un valor entero' })
  @Min(1, { message: 'Debes asignar al menos uno' })
  quantity: number;
}
