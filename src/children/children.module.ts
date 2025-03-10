import { Module } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { ChildrenController } from './children.controller';
import { Gender } from '../genders/entities/gender.entity';
import { Affiliate } from 'src/affiliates/entities/affiliate.entity';
import { Child } from './entities/child.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Child, Affiliate, Gender])],
  controllers: [ChildrenController],
  providers: [ChildrenService],
})
export class ChildrenModule {}
