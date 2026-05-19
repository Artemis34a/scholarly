import { Test, TestingModule } from '@nestjs/testing';
import { AnneeAcademiqueService } from './annee-academique.service';

describe('AnneeAcademiqueService', () => {
  let service: AnneeAcademiqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnneeAcademiqueService],
    }).compile();

    service = module.get<AnneeAcademiqueService>(AnneeAcademiqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
