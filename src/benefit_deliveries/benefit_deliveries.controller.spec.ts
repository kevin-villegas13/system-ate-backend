import { Test, TestingModule } from '@nestjs/testing';
import { BenefitDeliveriesController } from './benefit_deliveries.controller';
import { BenefitDeliveriesService } from './benefit_deliveries.service';

describe('BenefitDeliveriesController', () => {
  let controller: BenefitDeliveriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BenefitDeliveriesController],
      providers: [BenefitDeliveriesService],
    }).compile();

    controller = module.get<BenefitDeliveriesController>(BenefitDeliveriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
