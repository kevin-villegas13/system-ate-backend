import { Test, TestingModule } from '@nestjs/testing';
import { BenefitDeliveriesService } from './benefit_deliveries.service';

describe('BenefitDeliveriesService', () => {
  let service: BenefitDeliveriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BenefitDeliveriesService],
    }).compile();

    service = module.get<BenefitDeliveriesService>(BenefitDeliveriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
