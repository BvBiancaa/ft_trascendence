import { Test, TestingModule } from '@nestjs/testing';
import { UsrsService } from './usrs.service';

describe('UsrsService', () => {
  let service: UsrsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsrsService],
    }).compile();

    service = module.get<UsrsService>(UsrsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
