import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    const roles = ['Administrador', 'Empleado'];

    for (const roleName of roles) {
      const exists = await this.roleRepository.findOne({
        where: { roleName },
      });

      if (!exists) {
        const role = this.roleRepository.create({ roleName });
        await this.roleRepository.save(role);
      }
    }
  }

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
