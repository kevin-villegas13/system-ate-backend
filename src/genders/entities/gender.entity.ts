import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { GenderEnum } from './enums/gender.enum';

@Entity('genders')
export class Gender {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    unique: true,
    nullable: false,
    enum: GenderEnum,
  })
  genderName: GenderEnum;
}
