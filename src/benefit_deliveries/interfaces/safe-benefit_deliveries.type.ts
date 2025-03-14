import { Benefit } from '../../benefits/entities/benefit.entity';
import { Delegate } from '../../delegates/entities/delegate.entity';
import { BenefitDistribution } from '../entities/benefit_delivery.entity';
import { Affiliate } from '../../affiliates/entities/affiliate.entity';
import { Child } from '../../children/entities/child.entity';

// Campos sensibles o irrelevantes a omitir
type BaseSafeEntity = 'dni' | 'createdAt' | 'updatedAt' | 'isActive';

// Tipos seguros de cada entidad
export type SafeBenefit = Omit<Benefit, 'createdAt' | 'updatedAt' | 'stock'>;
export type SafeDelegate = Omit<Delegate, BaseSafeEntity>;
export type SafeAffiliate = Omit<
  Affiliate,
  BaseSafeEntity | 'contact' | 'address' | 'note'
>;
export type SafeChild = Omit<Child, BaseSafeEntity | 'note'>;

// Tipo seguro para la distribución de beneficios
export type SafeBenefitDistribution = Omit<
  BenefitDistribution,
  'benefit' | 'delegate' | 'affiliate' | 'child'
> & {
  id: string;
  benefit: SafeBenefit;
  delegate: SafeDelegate;
  affiliate?: SafeAffiliate | null;
  child?: SafeChild | null;
};
