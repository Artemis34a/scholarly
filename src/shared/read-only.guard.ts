/**
 * read-only.guard.ts
 *
 * Protège les routes d'écriture (POST, PUT, PATCH, DELETE)
 * quand DB_MODE=remote.
 *
 * Usage — appliquer sur un controller entier ou méthode par méthode :
 *
 *   @UseGuards(ReadOnlyGuard)          ← bloque toutes les écritures du controller
 *   @SkipReadOnlyCheck()               ← lève l'interdiction sur une méthode précise
 *
 * Les GET passent toujours.
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isRemoteMode } from '../config/database.config';

/** Décorateur pour autoriser l'écriture même en mode remote */
export const SKIP_READONLY = 'skipReadOnly';
export const SkipReadOnlyCheck = () => SetMetadata(SKIP_READONLY, true);

/** Méthodes HTTP considérées comme "écriture" */
const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

@Injectable()
export class ReadOnlyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Si on n'est pas en mode remote, tout est permis
    if (!isRemoteMode()) return true;

    // Le décorateur @SkipReadOnlyCheck() lève la restriction
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_READONLY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const method  = request.method.toUpperCase();

    if (WRITE_METHODS.has(method)) {
      throw new ForbiddenException(
        '🚫 BD distante (mode remote) — les écritures sont désactivées. ' +
        'Passe DB_MODE=local dans ton .env pour activer les POST/PUT/DELETE.'
      );
    }

    return true;
  }
}
