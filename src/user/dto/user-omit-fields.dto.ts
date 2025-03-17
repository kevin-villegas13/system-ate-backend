import { User } from 'src/user/entities/user.entity';
import { OmitProperties } from '../../common/enities/omit-properties.entity';
import { Role } from '../../role/entities/role.entity';

export type OmitRole = OmitProperties<Role, 'id'>;

export interface UserDto
  extends OmitProperties<
    User,
    'createdAt' | 'updatedAt' | 'password' | 'role'
  > {
  role?: OmitRole;
}
