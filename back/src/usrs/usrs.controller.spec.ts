import { Test, TestingModule } from '@nestjs/testing';
import { UsrsController } from './usrs.controller';
import { UsrsService } from './usrs.service';

describe('UsrsController', () => {
  let controller: UsrsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsrsController],
      providers: [UsrsService],
    }).compile();

    controller = module.get<UsrsController>(UsrsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
