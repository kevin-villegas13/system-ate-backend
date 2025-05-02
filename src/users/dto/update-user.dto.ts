import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { toBoolean } from '../../common/transformers/to-boolean';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsBoolean()
  @Transform(toBoolean)
  isActive?: boolean;
}
