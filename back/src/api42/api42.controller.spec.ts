import { Test, TestingModule } from '@nestjs/testing';
import { Api42Controller } from './api42.controller';
import { Api42Service } from './api42.service';

describe('Api42Controller', () => {
  let controller: Api42Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Api42Controller],
      providers: [Api42Service],
    }).compile();

    controller = module.get<Api42Controller>(Api42Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
