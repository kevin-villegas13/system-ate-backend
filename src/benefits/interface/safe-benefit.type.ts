import { Benefit } from '../entities/benefit.entity';

export type SafeBenefit = Omit<Benefit, 'createdAt' | 'updatedAt'>;
