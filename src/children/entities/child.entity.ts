import { Affiliate } from 'src/affiliates/entities/affiliate.entity';
import { BaseEntity } from 'src/common/enities/base-entity';
import { Gender } from '../../genders/entities/gender.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BenefitDistribution } from '../../benefit_deliveries/entities/benefit_delivery.entity';
import { calculateAge } from '../utils/age-calculator';

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

  @Column({ type: 'int', nullable: true })
  age: number;

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

  @BeforeInsert()
  @BeforeUpdate()
  updateAge(): void {
    // Validación para asegurarse que birthDate no sea null, undefined o inválido
    if (this.birthDate && !isNaN(new Date(this.birthDate).getTime())) {
      this.age = calculateAge(new Date(this.birthDate)); // Pasar la fecha como objeto Date
    } else {
      throw new Error('La fecha de nacimiento no es válida o está vacía');
    }
  } 
}
