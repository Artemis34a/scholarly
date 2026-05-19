import { Test, TestingModule } from '@nestjs/testing';
import { TitulaireService } from './titulaire.service';

describe('TitulaireService', () => {
  let service: TitulaireService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TitulaireService],
    }).compile();

    service = module.get<TitulaireService>(TitulaireService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
