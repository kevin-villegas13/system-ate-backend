import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'role_name',
    length: 20,
    unique: true,
    nullable: false,
  })
  roleName: string;
}
