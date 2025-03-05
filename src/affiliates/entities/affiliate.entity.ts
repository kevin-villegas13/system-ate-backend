import { BaseEntity } from '../../common/enities/base-entity';
import { Child } from '../../children/entities/child.entity';
import { Gender } from '../../genders/entities/gender.entity';
import { Sector } from '../../sectors/entities/sector.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('affiliates')
export class Affiliate extends BaseEntity {
  @Column({ unique: true, name: 'affiliate_code' })
  affiliateCode: string;

  @Column({ name: 'affiliate_name', length: 200 })
  affiliateName: string;

  @Column({ unique: true, length: 20 })
  dni: string;

  @ManyToOne(() => Gender, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gender_id' })
  gender: Gender;

  @Column({ nullable: true, length: 100 })
  email: string;

  @Column({ nullable: true, length: 100 })
  contact: string;

  @ManyToOne(() => Sector, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sector_id' })
  sector: Sector;

  @Column({ name: 'has_children', default: false })
  hasChildren: boolean;

  @Column({ name: 'has_disability', default: false })
  hasDisability: boolean;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Child, (child) => child.affiliate)
  children: Child[];
}
