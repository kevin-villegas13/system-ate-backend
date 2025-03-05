import { Module } from '@nestjs/common';
import { AffiliatesService } from './affiliates.service';
import { AffiliatesController } from './affiliates.controller';
import { Affiliate } from './entities/affiliate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sector } from '../sectors/entities/sector.entity';
import { Gender } from '../genders/entities/gender.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Affiliate, Gender, Sector])],
  controllers: [AffiliatesController],
  providers: [AffiliatesService],
})
export class AffiliatesModule {}
