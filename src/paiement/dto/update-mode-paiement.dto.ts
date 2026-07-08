import { PartialType } from '@nestjs/swagger';
import { CreateModePaiementDto } from './create-mode-paiement.dto';

export class UpdateModePaiementDto extends PartialType(CreateModePaiementDto) {}
