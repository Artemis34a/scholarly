import { Test, TestingModule } from '@nestjs/testing';
import { EmploiDeTempsService } from './emploi-de-temps.service';

describe('EmploiDeTempsService', () => {
  let service: EmploiDeTempsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmploiDeTempsService],
    }).compile();

    service = module.get<EmploiDeTempsService>(EmploiDeTempsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
