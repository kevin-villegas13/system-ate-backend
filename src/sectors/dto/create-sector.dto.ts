import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateSectorDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 12)
  sectorCode: string;
}
