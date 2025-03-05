import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AffiliatesService } from './affiliates.service';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { PaginationAffiliatesDto } from './dto/paginador-affiliates.dto';
import { ResponseList } from 'src/common/paginator/type/paginator.interface';
import { Affiliate } from './entities/affiliate.entity';
import { Response } from 'src/common/response/response.type';
//import { AuthDecorator } from '..//common/decorators/jwt.decorator';

@Controller('affiliates')
//@AuthDecorator()
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAffiliateDto: CreateAffiliateDto,
  ): Promise<Response<Affiliate>> {
    return this.affiliatesService.create(createAffiliateDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAffiliates(
    @Query() paginationDto: PaginationAffiliatesDto,
  ): Promise<ResponseList<Affiliate>> {
    console.log(paginationDto);
    return this.affiliatesService.getAllAffiliates(paginationDto);
  }

  @Get(':affiliate_code')
  @HttpCode(HttpStatus.OK)
  async getAffiliateByAffiliateCode(
    @Param('affiliate_code') affiliate_code: string,
  ) {
    return this.affiliatesService.getAffiliateByAffiliateCode(affiliate_code);
  }
}
