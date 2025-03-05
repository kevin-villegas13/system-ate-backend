import { Benefit } from '../../benefits/entities/benefit.entity';
import { Delegate } from '../../delegates/entities/delegate.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('delegate_benefits')
export class DelegateBenefit {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Benefit, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'benefit_id' })
  benefit: Benefit;

  @ManyToOne(() => Delegate, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'delegate_id' })
  delegate: Delegate;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'assignment_date', type: 'timestamp', nullable: true })
  assignmentDate: Date;
}
