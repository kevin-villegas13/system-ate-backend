import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { DeliveryService } from './delivery.service';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.deliveryService.getAllDeliveryStatus();
  }
}
