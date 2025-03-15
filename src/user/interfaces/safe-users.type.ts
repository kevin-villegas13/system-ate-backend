import { Role } from '../../role/entities/role.entity';
import { User } from '../entities/user.entity';

export type SafeRole = Omit<Role, 'id'>;

export interface SafeUser
  extends Omit<User, 'createdAt' | 'updatedAt' | 'password' | 'role'> {
  role?: SafeRole;
}
