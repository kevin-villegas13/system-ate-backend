import { PartialType } from '@nestjs/mapped-types';
import { CreateBenefitDeliveryDto } from './create-benefit_delivery.dto';

export class UpdateBenefitDeliveryDto extends PartialType(CreateBenefitDeliveryDto) {}
