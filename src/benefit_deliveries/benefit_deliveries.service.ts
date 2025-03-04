import { Injectable } from '@nestjs/common';
import { CreateBenefitDeliveryDto } from './dto/create-benefit_delivery.dto';
import { UpdateBenefitDeliveryDto } from './dto/update-benefit_delivery.dto';

@Injectable()
export class BenefitDeliveriesService {
  create(createBenefitDeliveryDto: CreateBenefitDeliveryDto) {
    return 'This action adds a new benefitDelivery';
  }

  findAll() {
    return `This action returns all benefitDeliveries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} benefitDelivery`;
  }

  update(id: number, updateBenefitDeliveryDto: UpdateBenefitDeliveryDto) {
    return `This action updates a #${id} benefitDelivery`;
  }

  remove(id: number) {
    return `This action removes a #${id} benefitDelivery`;
  }
}
