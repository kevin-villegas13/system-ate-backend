import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';
import { Repository } from 'typeorm';
import { DeliveryStatus } from './entities/enums/delivery-status.enum';

@Injectable()
export class DeliveryService implements OnModuleInit {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
  ) {}

  async onModuleInit() {
    const statuses = Object.values(DeliveryStatus);

    const existingStatuses = await this.deliveryRepository.find();
    const existingNames = new Set(existingStatuses.map((s) => s.status));

    const newStatuses = statuses
      .filter((statusName) => !existingNames.has(statusName))
      .map((statusName) =>
        this.deliveryRepository.create({ status: statusName }),
      );

    if (newStatuses.length > 0) await this.deliveryRepository.save(newStatuses);
  }

  async getAllDeliveryStatus(): Promise<Delivery[]> {
    return this.deliveryRepository.find();
  }
}
