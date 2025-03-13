import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DeliveryStatus } from './entities/delivery.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryStatus])],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
