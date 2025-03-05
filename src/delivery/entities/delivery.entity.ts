import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('delivery_status')
export class DeliveryStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50, name: 'status_name' })
  statusName: string;
}
