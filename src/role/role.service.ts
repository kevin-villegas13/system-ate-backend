import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { RoleEnum } from './entities/enum/role.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    const roles = Object.values(RoleEnum);

    // Buscar solo los roles que existen en la BD
    const existingRoles = await this.roleRepository.find();
    const existingRoleNames = new Set(
      existingRoles.map((role) => role.roleName),
    );

    // Filtrar los roles que aún no existen
    const newRoles = roles
      .filter((roleName) => !existingRoleNames.has(roleName))
      .map((roleName) => this.roleRepository.create({ roleName }));

    if (newRoles.length > 0) {
      await this.roleRepository.save(newRoles);
      console.log(
        `✅ Se insertaron los roles: ${newRoles.map((r) => r.roleName).join(', ')}`,
      );
    } else {
      console.log('ℹ️ Todos los roles ya estaban creados.');
    }
  }

  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
