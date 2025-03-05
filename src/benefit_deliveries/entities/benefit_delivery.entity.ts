import { BaseEntity } from '../../common/enities/base-entity';
import { Benefit } from '../../benefits/entities/benefit.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RecipientType } from '../../recipient/entities/recipient.entity';
import { DeliveryStatus } from '../../delivery/entities/delivery.entity';

@Entity('benefit_distribution')
export class BenefitDistribution extends BaseEntity {
  @ManyToOne(() => Benefit, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'benefit_id' })
  benefit: Benefit;

  @Column({ name: 'recipient_id' })
  recipientId: number;

  @ManyToOne(() => RecipientType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_type_id' })
  recipientType: RecipientType;

  @Column({ default: 1 })
  quantity: number;

  @Column({ name: 'delivery_date', type: 'timestamp', nullable: true })
  deliveryDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => DeliveryStatus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'status_id' })
  status: DeliveryStatus;
}
