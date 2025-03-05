import { Benefit } from '../../benefits/entities/benefit.entity';
import { BaseEntity } from '../../common/enities/base-entity';
import { Delegate } from '../../delegates/entities/delegate.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('delegate_assignments')
export class DelegateAssignment extends BaseEntity {
  @ManyToOne(() => Delegate)
  delegate: Delegate;

  @ManyToOne(() => Benefit)
  benefit: Benefit;

  @Column({ type: 'date' })
  assignedAt: Date;
}
