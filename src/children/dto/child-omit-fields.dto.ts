import { Child } from '../entities/child.entity';
import { Gender } from '../../genders/entities/gender.entity';
import { Affiliate } from '../../affiliates/entities/affiliate.entity';
import { OmitProperties } from '../../common/enities/omit-properties.entity';

export type OmitGender = Gender;

export type OmitChild = Pick<
  Child,
  | 'id'
  | 'dni'
  | 'firstName'
  | 'lastName'
  | 'birthDate'
  | 'age'
  | 'benefitDistributions'
> & { gender: OmitGender };

export type OmitAffiliate = OmitProperties<
  Omit<Affiliate, 'children'>,
  'note' | 'createdAt' | 'updatedAt' | 'contact'
> & { children: OmitChild[] };

export interface ChildDto
  extends OmitProperties<
    Child,
    'createdAt' | 'updatedAt' | 'note' | 'affiliate' | 'updateAge'
  > {
  gender: OmitGender;
}
