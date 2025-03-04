import { Module } from '@nestjs/common';
import { DelegatesService } from './delegates.service';
import { DelegatesController } from './delegates.controller';

@Module({
  controllers: [DelegatesController],
  providers: [DelegatesService],
})
export class DelegatesModule {}
