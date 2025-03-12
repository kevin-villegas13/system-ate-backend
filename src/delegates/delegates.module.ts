import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DelegatesService } from './delegates.service';
import { DelegatesController } from './delegates.controller';
import { Delegate } from './entities/delegate.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Delegate]), AuthModule],
  controllers: [DelegatesController],
  providers: [DelegatesService],
})
export class DelegatesModule {}
