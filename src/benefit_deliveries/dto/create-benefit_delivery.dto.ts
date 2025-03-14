import {
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
  IsOptional,
  IsInt,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateBenefitDeliveryDto {
  @IsUUID('4', { message: 'Selecciona un beneficio válido.' })
  @IsNotEmpty({ message: 'El beneficio es obligatorio.' })
  benefitId: string;

  @IsUUID('4', { message: 'Selecciona un destinatario válido.' })
  @IsNotEmpty({ message: 'El destinatario es obligatorio.' })
  recipientId: string;

  @IsInt({ message: 'Selecciona un tipo de destinatario válido.' })
  @IsNotEmpty({ message: 'El tipo de destinatario es obligatorio.' })
  recipientType: number;

  @IsInt({ message: 'Selecciona un estado válido.' })
  @IsNotEmpty({ message: 'El estado es obligatorio.' })
  statusId: number;

  @IsNumber({}, { message: 'La cantidad debe ser un número.' })
  @Min(1, { message: 'La cantidad debe ser al menos 1.' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria.' })
  quantity: number;

  @IsNotEmpty({ message: 'La fecha de entrega es obligatoria.' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha de entrega debe estar en formato YYYY-MM-DD.',
  })
  @ValidateIf((_, value) => value <= new Date().toISOString().split('T')[0], {
    message: 'La fecha de entrega no puede ser futura.',
  })
  deliveryDate: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Las notas no pueden estar vacías.' })
  notes?: string;
}
