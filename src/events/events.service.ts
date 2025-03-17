import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventType } from './entities/event_type.entity';
import { CreateEventTypeDto } from './dto/create-eventType.dto';
import { Response } from '../common/response/response.type';
import { Conflict, NotFound, Unauthorized } from '../common/exceptions';
import { Event } from './entities/event.entity';
import { EventStatus } from './entities/enums/event-status.enum';
import { User } from '../user/entities/user.entity';
import { PaginationEventsDto } from './dto/paginador-event.dto';
import {
  ResponseList,
  SortOrder,
} from 'src/common/paginator/type/paginator.interface';
import { Paginator } from '../common/paginator/paginator.helper';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(EventType)
    private readonly eventTypeRepository: Repository<EventType>,
  ) {}

  async createEventType(dto: CreateEventTypeDto): Promise<Response<null>> {
    const { typeName } = dto;

    const existingEventType = await this.eventTypeRepository.findOne({
      where: { typeName: typeName },
    });

    if (existingEventType) throw new Conflict('El tipo de evento ya existe.');

    const eventType = this.eventTypeRepository.create(dto);
    await this.eventTypeRepository.save(eventType);
    return {
      status: true,
      message: 'Tipo de evento creado correctamente',
      data: null,
    };
  }

  async createEvent(
    dto: CreateEventDto,
    user_id: string,
  ): Promise<Response<null>> {
    const { eventTypeId, name } = dto;

    const eventType = await this.eventTypeRepository.findOne({
      where: { id: eventTypeId },
    });

    if (!eventType) throw new NotFound('El tipo de evento no existe.');

    const existingEvent = await this.eventRepository.findOne({
      where: { name: name },
    });

    if (existingEvent)
      throw new Conflict('Ya tienes un evento con este nombre.');

    const event = this.eventRepository.create({
      ...dto,
      eventType: { id: eventTypeId },
      user: { id: user_id },
    });

    await this.eventRepository.save(event);

    return {
      status: true,
      message: 'Evento creado correctamente',
      data: null,
    };
  }

  async paginateEvents(
    paginationDto: PaginationEventsDto,
  ): Promise<ResponseList<Event>> {
    const {
      page,
      limit,
      search,
      order = SortOrder.ASC,
      eventTypeId,
    } = paginationDto;

    const currentPage = Math.max(1, page);
    const currentLimit = Math.max(1, limit);

    const where: FindOptionsWhere<Event> = {
      ...(eventTypeId && { eventType: { id: eventTypeId } }),
      ...(search && {
        name: ILike(`%${search}%`),
      }),
    };

    const [data, count] = await this.eventRepository.findAndCount({
      where,
      relations: ['eventType'],
      order: { name: order },
      skip: (currentPage - 1) * currentLimit,
      take: currentLimit,
    });

    return Paginator.Format(
      data,
      count,
      currentPage,
      currentLimit,
      search,
      order,
    );
  }

  async getEventById(id: string): Promise<Response<Event>> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['eventType', 'user'],
    });

    if (!event) throw new NotFound('Evento no encontrado.');

    return {
      status: true,
      message: 'Evento obtenido correctamente',
      data: event,
    };
  }

  async updateEvent(
    id: string,
    user_id: string,
    dto: UpdateEventDto,
  ): Promise<Response<null>> {
    const { eventTypeId } = dto;

    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!event) throw new NotFound('Evento no encontrado.');

    if (event.user.id !== user_id)
      throw new Unauthorized('No tienes permiso para actualizar este evento.');

    const eventType = await this.eventTypeRepository.findOne({
      where: { id: eventTypeId },
    });

    if (!eventType) throw new NotFound('El tipo de evento no existe.');

    event.user = { id: user_id } as User;
    event.eventType = eventType;

    Object.assign(event, dto);
    await this.eventRepository.save(event);

    return {
      status: true,
      message: 'Evento actualizado correctamente',
      data: null,
    };
  }

  async cancelEvent(id: string): Promise<Response<null>> {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) throw new NotFound('Evento no encontrado.');

    event.status = EventStatus.CANCELLED;
    await this.eventRepository.save(event);

    return {
      status: true,
      message: 'Evento cancelado correctamente',
      data: null,
    };
  }

  async deleteEvent(id: string): Promise<Response<null>> {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) throw new NotFound('Evento no encontrado.');

    await this.eventRepository.remove(event);

    return {
      status: true,
      message: 'Evento eliminado correctamente',
      data: null,
    };
  }
}
