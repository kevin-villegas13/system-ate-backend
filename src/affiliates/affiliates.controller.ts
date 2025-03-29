import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AffiliatesService } from './affiliates.service';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { PaginationAffiliatesDto } from './dto/paginador-affiliates.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';
import { Authorize } from '../common/decorators/authorize.decorator';
import { RoleEnum } from '../role/entities/enum/role.enum';

@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Post()
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAffiliateDto, @GetUser() user: User) {
    return this.affiliatesService.create(dto, user?.id);
  }

  @Get()
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  async paginatedAffiliates(@Query() dto: PaginationAffiliatesDto) {
    return this.affiliatesService.paginatedAffiliates(dto);
  }

  @Get('sectors')
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  async getAffiliatesWithSectors() {
    return this.affiliatesService.sectorsAffiliates();
  }

  @Get(':affiliate_code')
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  async getAffiliateByAffiliateCode(
    @Param('affiliate_code') affiliate_code: string,
  ) {
    return this.affiliatesService.getAffiliateByAffiliateCode(affiliate_code);
  }

  @Patch(':id')
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateAffiliateDto) {
    return this.affiliatesService.update(id, dto);
  }

  @Delete(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.affiliatesService.remove(id);
  }
}
