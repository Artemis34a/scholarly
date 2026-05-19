import { Test, TestingModule } from '@nestjs/testing';
import { VilleNaissanceService } from './ville-naissance.service';

describe('VilleNaissanceService', () => {
  let service: VilleNaissanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VilleNaissanceService],
    }).compile();

    service = module.get<VilleNaissanceService>(VilleNaissanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
