import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { EventType } from './event_type.entity';
import { User } from 'src/user/entities/user.entity';
import { BaseEntity } from '../../common/enities/base-entity';
import { EventStatus } from './enums/event-status.enum';

@Entity('events')
export class Event extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.ACTIVE })
  status: EventStatus;

  @ManyToOne(() => EventType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_type_id' })
  eventType: EventType;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
