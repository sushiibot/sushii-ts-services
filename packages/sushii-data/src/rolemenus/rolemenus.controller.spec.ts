import { Test, TestingModule } from '@nestjs/testing';
import { RolemenusController } from './rolemenus.controller';
import { RolemenusService } from './rolemenus.service';

describe('RolemenusController', () => {
  let controller: RolemenusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolemenusController],
      providers: [RolemenusService],
    }).compile();

    controller = module.get<RolemenusController>(RolemenusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
