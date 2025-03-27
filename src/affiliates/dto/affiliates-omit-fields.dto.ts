import { Affiliate } from '../entities/affiliate.entity';
import { OmitProperties } from '../../common/enities/omit-properties.entity';
import { Sector } from '../../sectors/entities/sector.entity';

export type OmitSector = OmitProperties<Sector, 'createdAt' | 'updatedAt'>;

export interface AffiliateDto
  extends OmitProperties<
    Affiliate,
    'note' | 'createdAt' | 'updatedAt' | 'sector'
  > {
  sector?: OmitSector;
}
