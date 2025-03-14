import { Benefit } from '../../benefits/entities/benefit.entity';
import { Delegate } from '../../delegates/entities/delegate.entity';
import { BenefitDistribution } from '../entities/benefit_delivery.entity';

export type SafeBenefit = Omit<Benefit, 'createdAt' | 'updatedAt' | 'stock'>;

export type SafeDelegate = Omit<
  Delegate,
  'dni' | 'createdAt' | 'updatedAt' | 'isActive'
>;

export type SafeBenefitDistribution = Omit<
  BenefitDistribution,
  'benefit' | 'delegate'
> & {
  benefit: SafeBenefit;
  delegate: SafeDelegate;
  id: string;
};
