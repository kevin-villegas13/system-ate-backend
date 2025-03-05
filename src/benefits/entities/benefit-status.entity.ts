import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('benefit_status')
export class BenefitStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  statusName: string;
}
