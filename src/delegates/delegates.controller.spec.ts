import { Test, TestingModule } from '@nestjs/testing';
import { DelegatesController } from './delegates.controller';
import { DelegatesService } from './delegates.service';

describe('DelegatesController', () => {
  let controller: DelegatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DelegatesController],
      providers: [DelegatesService],
    }).compile();

    controller = module.get<DelegatesController>(DelegatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
