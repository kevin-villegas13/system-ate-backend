import { Module } from '@nestjs/common';
import { RecipientService } from './recipient.service';
import { RecipientController } from './recipient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipientType } from './entities/recipient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipientType])],
  controllers: [RecipientController],
  providers: [RecipientService],
})
export class RecipientModule {}
