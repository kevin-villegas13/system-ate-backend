import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/enities/base-entity';
import { EventType } from './event_type.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('events')
export class Event extends BaseEntity {
  @ManyToOne(() => EventType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'event_type_id' })
  eventType: EventType;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 50 })
  category: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

}
