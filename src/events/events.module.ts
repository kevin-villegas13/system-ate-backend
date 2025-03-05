import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventTypeService } from './event-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventType } from './entities/event_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventType])],
  controllers: [EventsController],
  providers: [EventsService, EventTypeService],
})
export class EventsModule {}
