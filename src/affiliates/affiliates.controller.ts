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
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';

@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateAffiliateDto, @GetUser() user: User) {
    return this.affiliatesService.create(dto, user?.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async paginatedAffiliates(@Query() dto: PaginationAffiliatesDto) {
    return this.affiliatesService.paginatedAffiliates(dto);
  }

  @Get(':affiliate_code')
  @HttpCode(HttpStatus.OK)
  async getAffiliateByAffiliateCode(
    @Param('affiliate_code') affiliate_code: string,
  ) {
    return this.affiliatesService.getAffiliateByAffiliateCode(affiliate_code);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateAffiliateDto) {
    return this.affiliatesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.affiliatesService.remove(id);
  }
}
