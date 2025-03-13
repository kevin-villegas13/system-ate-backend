import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryStatus } from './entities/delivery.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeliveryService implements OnModuleInit {
  constructor(
    @InjectRepository(DeliveryStatus)
    private readonly deliveryRepository: Repository<DeliveryStatus>,
  ) {}

  async onModuleInit() {
    const deliveryStatuses = [
      'Pendiente',
      'En Proceso',
      'Entregado',
      'Fallido',
      'Cancelado',
      'Retrasado',
    ];

    for (const statusName of deliveryStatuses) {
      const exists = await this.deliveryRepository.findOne({
        where: { statusName },
      });

      if (!exists) await this.deliveryRepository.save({ statusName });
    }
  }

  async getAllDeliveryStatus(): Promise<DeliveryStatus[]> {
    return this.deliveryRepository.find();
  }
}
