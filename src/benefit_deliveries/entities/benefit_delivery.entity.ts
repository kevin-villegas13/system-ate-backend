import { BaseEntity } from '../../common/enities/base-entity';
import { Benefit } from '../../benefits/entities/benefit.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RecipientType } from '../../recipient/entities/recipient.entity';
import { DeliveryStatus } from '../../delivery/entities/delivery.entity';
import { Affiliate } from '../../affiliates/entities/affiliate.entity';
import { Child } from '../../children/entities/child.entity';

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

  @ManyToOne(() => RecipientType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_type_id' })
  recipientType: RecipientType;

  @Column({ default: 1 })
  quantity: number;

  @Column({ name: 'delivery_date', type: 'date', nullable: true })
  deliveryDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => DeliveryStatus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'status_id' })
  status: DeliveryStatus;
}
