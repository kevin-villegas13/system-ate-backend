import { BaseEntity } from '../../common/enities/base-entity';
import { Benefit } from '../../benefits/entities/benefit.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Affiliate } from '../../affiliates/entities/affiliate.entity';
import { Child } from '../../children/entities/child.entity';
import { Delivery } from '../../delivery/entities/delivery.entity';
import { Recipient } from 'src/recipient/entities/recipient.entity';

@Entity('benefit_distribution')
export class BenefitDistribution extends BaseEntity {
  @ManyToOne(() => Benefit, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'benefit_id' })
  benefit: Benefit;

  @ManyToOne(() => Affiliate, (affiliate) => affiliate.benefitDistributions, {
    nullable: true,
  })
  @JoinColumn({ name: 'affiliate_id' })
  affiliate: Affiliate;

  @ManyToOne(() => Child, (child) => child.benefitDistributions, {
    nullable: true,
  })
  @JoinColumn({ name: 'child_id' })
  child?: Child | null;

  @ManyToOne(() => Recipient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_type_id' })
  recipientType: Recipient;

  @Column({ default: 1 })
  quantity: number;

  @Column({ name: 'delivery_date', type: 'date', nullable: true })
  deliveryDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Delivery, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'status_id' })
  status: Delivery;
}
