import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DeliveryStatus } from './enums/delivery-status.enum';

@Entity('delivery_status')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    unique: true,
    nullable: false,
    enum: DeliveryStatus,
  })
  status: DeliveryStatus;
}
