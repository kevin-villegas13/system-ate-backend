import { IsString, Length } from 'class-validator';

export class CreateBenefitTypeDto {
  @IsString({ message: 'El nombre del tipo de beneficio debe ser un texto.' })
  @Length(1, 50, {
    message:
      'El nombre del tipo de beneficio debe tener entre 1 y 50 caracteres.',
  })
  typeName: string;
}
