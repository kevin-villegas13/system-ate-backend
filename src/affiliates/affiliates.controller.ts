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
  Req,
} from '@nestjs/common';
import { AffiliatesService } from './affiliates.service';
import { CreateAffiliateDto } from './dto/create-affiliate.dto';
import { PaginationAffiliatesDto } from './dto/paginador-affiliates.dto';
import { ResponseList } from 'src/common/paginator/type/paginator.interface';
import { Affiliate } from './entities/affiliate.entity';
import { Response } from 'src/common/response/response.type';
import { AuthDecorator } from '..//common/decorators/jwt.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UpdateAffiliateDto } from './dto/update-affiliate.dto';

@Controller('affiliates')
@AuthDecorator()
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createAffiliateDto: CreateAffiliateDto,
    @GetUser() user: User,
  ): Promise<Response<Affiliate>> {
    return this.affiliatesService.create(createAffiliateDto, user?.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAffiliates(@Query() paginationDto: PaginationAffiliatesDto) {
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

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateAffiliateDto: UpdateAffiliateDto,
  ) {
    return this.affiliatesService.update(id, updateAffiliateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.affiliatesService.remove(id);
  }
}
