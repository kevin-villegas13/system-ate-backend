import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/enities/base-entity';
import { Sector } from '../../sectors/entities/sector.entity';
import { DelegateStatus } from './delegate-status.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('delegates')
export class Delegate extends BaseEntity {
  @Column({ name: 'first_name', length: 50 })
  firstName: string;

  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  @Column({ unique: true, length: 20 })
  dni: string;

  @ManyToOne(() => Sector, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sector_id' })
  sector: Sector;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => DelegateStatus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'status_id' })
  status: DelegateStatus;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
