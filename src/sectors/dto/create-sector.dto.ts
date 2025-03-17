import { IsNotEmpty } from 'class-validator';
import { IsValidName } from '../../common/validators/is-valid-name';
import { IsValidCode } from '../../common/validators/is-valid-code';

export class CreateSectorDto {
  @IsNotEmpty({ message: 'El nombre del sector es obligatorio.' })
  @IsValidName()
  name: string;

  @IsNotEmpty({ message: 'El código del sector es obligatorio.' })
  @IsValidCode()
  sectorCode: string;
}
