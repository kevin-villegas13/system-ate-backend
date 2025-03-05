import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('genders')
export class Gender {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'gender_name', length: 10 })
  genderName: string;
}
