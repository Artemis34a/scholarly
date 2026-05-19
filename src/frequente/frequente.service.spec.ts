import { Test, TestingModule } from '@nestjs/testing';
import { FrequenteService } from './frequente.service';

describe('FrequenteService', () => {
  let service: FrequenteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FrequenteService],
    }).compile();

    service = module.get<FrequenteService>(FrequenteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
