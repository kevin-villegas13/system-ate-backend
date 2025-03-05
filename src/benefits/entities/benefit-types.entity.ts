import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('benefit_types')
export class BenefitType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  typeName: string;
}
