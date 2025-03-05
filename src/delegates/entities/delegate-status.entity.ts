import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('delegate_status')
export class DelegateStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status_name', length: 20, unique: true })
  statusName: string;
}
