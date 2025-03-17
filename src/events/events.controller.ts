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
import { EventsService } from './events.service';
import { CreateEventTypeDto } from './dto/create-eventType.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationEventsDto } from './dto/paginador-event.dto';
import { Authorize } from '../common/decorators/authorize.decorator';
import { RoleEnum } from '../role/entities/enum/role.enum';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('type')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createEventType(@Body() dto: CreateEventTypeDto) {
    return this.eventsService.createEventType(dto);
  }

  @Post()
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createEvent(@Body() dto: CreateEventDto, @GetUser() user: User) {
    console.log('User id: ', user.id);
    return this.eventsService.createEvent(dto, user?.id);
  }

  @Get()
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  paginateEvents(@Query() paginationDto: PaginationEventsDto) {
    return this.eventsService.paginateEvents(paginationDto);
  }

  @Get(':id')
  @Authorize(RoleEnum.ADMIN, RoleEnum.EMPLOYEE)
  @HttpCode(HttpStatus.OK)
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }

  @Patch(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  updateEvent(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() dto: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(id, user.id, dto);
  }

  @Patch(':id/cancel')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  cancelEvent(@Param('id') id: string) {
    return this.eventsService.cancelEvent(id);
  }

  @Delete(':id')
  @Authorize(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  deleteEvent(@Param('id') id: string) {
    return this.eventsService.deleteEvent(id);
  }
}
