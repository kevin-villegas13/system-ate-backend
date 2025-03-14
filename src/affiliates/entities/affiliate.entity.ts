import { BaseEntity } from '../../common/enities/base-entity';
import { Child } from '../../children/entities/child.entity';
import { Gender } from '../../genders/entities/gender.entity';
import { Sector } from '../../sectors/entities/sector.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BenefitDistribution } from '../../benefit_deliveries/entities/benefit_delivery.entity';

@Entity('affiliates')
export class Affiliate extends BaseEntity {
  @Column({ unique: true, name: 'affiliate_code' })
  @Index()
  affiliateCode: string;

  @Column({ name: 'name', length: 200 })
  name: string;

  @Column({ unique: true, length: 20 })
  @Index()
  dni: string;

  @ManyToOne(() => Gender, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gender_id' })
  gender: Gender;

  @Column({ nullable: true, length: 100 })
  email: string;

  @Column({ nullable: true, length: 15 })
  contact: string;

  @ManyToOne(() => Sector, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sector_id' })
  sector: Sector;

  @Column({ name: 'has_children', default: false })
  hasChildren: boolean;

  @Column({ name: 'has_disability', default: false })
  hasDisability: boolean;

  @Column({ nullable: true, length: 300 })
  note: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  createdBy: User;

  @OneToMany(() => Child, (child) => child.affiliate, { cascade: true })
  children: Child[];

  @Column({ nullable: true, name: 'birthdate', type: 'date' })
  birthdate: Date;

  @Column({ nullable: true, length: 200 })
  address: string;

  @OneToMany(
    () => BenefitDistribution,
    (benefitDistribution) => benefitDistribution.affiliate,
  )
  benefitDistributions: BenefitDistribution[];
}
