import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEnum } from './enum/role.enum';

@Entity('user_roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    enumName: 'role_enum',
    unique: true,
    nullable: false,
  })
  roleName: RoleEnum;
}
