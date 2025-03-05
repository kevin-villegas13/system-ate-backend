import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventType } from './entities/event_type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EventTypeService implements OnModuleInit {
  constructor(
    @InjectRepository(EventType)
    private readonly eventTypeRepository: Repository<EventType>,
  ) {}

  async onModuleInit() {
    const eventos = [
      'Creación',
      'Actualización',
      'Eliminación',
      'Entrega de Beneficio',
    ];
    for (const tipo of eventos) {
      const existe = await this.eventTypeRepository.findOneBy({
        type_name: tipo,
      });
      if (!existe) await this.create(tipo);
    }
  }

  async create(typeName: string): Promise<EventType> {
    const eventType = this.eventTypeRepository.create({ type_name: typeName });
    return this.eventTypeRepository.save(eventType);
  }

  async findAll(): Promise<EventType[]> {
    return this.eventTypeRepository.find();
  }
}
