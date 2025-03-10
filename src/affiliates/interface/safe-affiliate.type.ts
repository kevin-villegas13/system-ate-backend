import { Affiliate } from '../entities/affiliate.entity';
import { Sector } from 'src/sectors/entities/sector.entity';

export type SafeSector = Omit<Sector, 'createdAt' | 'updatedAt'>;

export interface SafeAffiliate
  extends Omit<Affiliate, 'note' | 'createdAt' | 'updatedAt' | 'sector'> {
  sector?: SafeSector;
}
