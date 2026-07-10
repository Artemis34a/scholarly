import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

// Traduit les erreurs Prisma non interceptées par les services (contrainte
// unique violée, clé étrangère invalide, valeur trop longue pour la colonne,
// enregistrement introuvable...) en réponses HTTP propres avec un message
// compréhensible, au lieu de les laisser remonter en 500 "Erreur interne du
// serveur". Avant ce filtre, un simple doublon (ex : double inscription, note
// en double) ou une valeur trop longue faisait planter la requête avec un
// message opaque ; ces cas sont désormais correctement transformés en 400/404/409.
function mapPrismaError(exception: Prisma.PrismaClientKnownRequestError): {
  status: number;
  message: string;
} {
  const target = Array.isArray(exception.meta?.target)
    ? (exception.meta?.target as string[]).join(', ')
    : (exception.meta?.target as string | undefined);

  switch (exception.code) {
    case 'P2002':
      return {
        status: HttpStatus.CONFLICT,
        message: target
          ? `Une donnée avec cette valeur (${target}) existe déjà.`
          : 'Cette ressource existe déjà.',
      };
    case 'P2003':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'La ressource référencée est invalide ou introuvable.',
      };
    case 'P2025':
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Ressource introuvable.',
      };
    case 'P2000':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: target
          ? `La valeur fournie pour « ${target} » est trop longue.`
          : 'Une des valeurs fournies est trop longue.',
      };
    case 'P2011':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: target
          ? `Le champ « ${target} » est obligatoire.`
          : 'Un champ obligatoire est manquant.',
      };
    case 'P2014':
    case 'P2004':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Cette opération viole une contrainte de la base de données.',
      };
    default:
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'La requête est invalide.',
      };
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status: number;
    let message: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const mapped = mapPrismaError(exception);
      status = mapped.status;
      message = mapped.message;
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Les données envoyées ne correspondent pas au format attendu.';
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erreur interne du serveur';
    }

    this.logger.error(
      `${req.method} ${req.url} → ${status}`,
      String(exception),
    );

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message,
    });
  }
}
