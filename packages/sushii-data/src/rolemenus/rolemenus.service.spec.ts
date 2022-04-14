import { Test, TestingModule } from '@nestjs/testing';
import { RolemenusService } from './rolemenus.service';

describe('RolemenusService', () => {
  let service: RolemenusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolemenusService],
    }).compile();

    service = module.get<RolemenusService>(RolemenusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
