import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllRoles() {
    return this.roleService.getAllRoles();
  }
}
