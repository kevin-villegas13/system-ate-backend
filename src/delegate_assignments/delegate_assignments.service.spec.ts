import { Test, TestingModule } from '@nestjs/testing';
import { DelegateAssignmentsService } from './delegate_assignments.service';

describe('DelegateAssignmentsService', () => {
  let service: DelegateAssignmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DelegateAssignmentsService],
    }).compile();

    service = module.get<DelegateAssignmentsService>(DelegateAssignmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
