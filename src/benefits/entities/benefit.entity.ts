import { BaseEntity } from '../../common/enities/base-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BenefitType } from './benefit-types.entity';
import { BenefitStatus } from './benefit-status.entity';

@Entity('benefits')
export class Benefit extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => BenefitType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'type_id' })
  type: BenefitType;

  @Column({ name: 'age_range', length: 50, nullable: true })
  ageRange: string;

  @Column({ default: 0 })
  stock: number;

  @ManyToOne(() => BenefitStatus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'status_id' })
  status: BenefitStatus;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;
}
