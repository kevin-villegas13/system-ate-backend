import { Benefit } from '../../benefits/entities/benefit.entity';

export type SafeDelegateAssignments = Omit<
  Benefit,
  'id' | 'ageRange' | 'isAvailable' | 'createdAt' | 'updatedAt'
>;
