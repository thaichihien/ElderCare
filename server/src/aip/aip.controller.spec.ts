import { Test, TestingModule } from '@nestjs/testing';
import { AipController } from './aip.controller';

describe('AipController', () => {
  let controller: AipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AipController],
    }).compile();

    controller = module.get<AipController>(AipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
