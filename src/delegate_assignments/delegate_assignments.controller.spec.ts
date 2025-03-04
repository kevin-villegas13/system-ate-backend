import { Test, TestingModule } from '@nestjs/testing';
import { DelegateAssignmentsController } from './delegate_assignments.controller';
import { DelegateAssignmentsService } from './delegate_assignments.service';

describe('DelegateAssignmentsController', () => {
  let controller: DelegateAssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DelegateAssignmentsController],
      providers: [DelegateAssignmentsService],
    }).compile();

    controller = module.get<DelegateAssignmentsController>(DelegateAssignmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
