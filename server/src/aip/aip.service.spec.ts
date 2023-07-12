import { Test, TestingModule } from '@nestjs/testing';
import { AipService } from './aip.service';

describe('AipService', () => {
  let service: AipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AipService],
    }).compile();

    service = module.get<AipService>(AipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
