import { Affiliate } from 'src/affiliates/entities/affiliate.entity';
import { BaseEntity } from 'src/common/enities/base-entity';
import { Gender } from '../../genders/entities/gender.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BenefitDistribution } from '../../benefit_deliveries/entities/benefit_delivery.entity';

@Entity('children')
export class Child extends BaseEntity {
  @Column({ unique: true, nullable: true })
  dni: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ type: 'date', name: 'birth_date', nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Gender)
  gender: Gender;

  @ManyToOne(() => Affiliate, (affiliate) => affiliate.children, {
    onDelete: 'CASCADE',
  })
  affiliate: Affiliate;

  @OneToMany(
    () => BenefitDistribution,
    (benefitDistribution) => benefitDistribution.child,
  )
  benefitDistributions: BenefitDistribution[];
}
