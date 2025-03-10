import { Gender } from 'src/genders/entities/gender.entity';
import { Child } from '../entities/child.entity';
import { Affiliate } from 'src/affiliates/entities/affiliate.entity';

export type SafeGender = Omit<Gender, 'createdAt' | 'updatedAt'>;

export interface SafeAffiliate
  extends Omit<Affiliate, 'note' | 'createdAt' | 'updatedAt' | 'contact'> {}

export interface SafeChild
  extends Omit<Child, 'createdAt' | 'updatedAt' | 'note' | 'affiliate'> {
  gender: SafeGender;
  affiliate: Pick<
    SafeAffiliate,
    'id' | 'affiliateCode' | 'name' | 'dni' | 'birthdate' | 'address'
  >;
}
