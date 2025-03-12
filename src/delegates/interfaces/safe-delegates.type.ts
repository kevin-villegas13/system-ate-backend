import { Delegate } from '../entities/delegate.entity';
import { Sector } from '../../sectors/entities/sector.entity';

export type SafeSector = Omit<Sector, 'createdAt' | 'updatedAt'>;

export interface SafeDelegate
  extends Omit<Delegate, 'createdAt' | 'updatedAt' | 'sector'> {
  sector?: SafeSector;
}
