/**
 * database.config.ts
 *
 * Construit l'URL de connexion Prisma selon DB_MODE.
 * Importé par PrismaService AVANT que le client soit instancié.
 *
 * Logique :
 *   DB_MODE=remote  → BD du prof  (163.123.183.89:17705)
 *   DB_MODE=local   → XAMPP local (localhost:3306)
 *   DATABASE_URL    → override manuel (prioritaire sur tout)
 */

import { Logger } from '@nestjs/common';

const log = new Logger('DatabaseConfig');

export function buildDatabaseUrl(): string {
  // Override manuel — si DATABASE_URL est renseignée dans .env, on l'utilise directement
  if (process.env.DATABASE_URL) {
    log.log('🔌 DATABASE_URL définie manuellement — connexion directe utilisée');
    return process.env.DATABASE_URL;
  }

  const mode = (process.env.DB_MODE ?? 'local').toLowerCase();

  let host: string;
  let port: string;
  let user: string;
  let password: string;
  let dbName: string;

  if (mode === 'remote') {
    host     = process.env.DB_REMOTE_HOST     ?? '163.123.183.89';
    port     = process.env.DB_REMOTE_PORT     ?? '17705';
    user     = process.env.DB_REMOTE_USER     ?? 'ecole';
    password = process.env.DB_REMOTE_PASSWORD ?? 'peda2026';
    dbName   = process.env.DB_REMOTE_NAME     ?? 'ecole2026';
    log.log(`🌐 Mode REMOTE — connexion à ${host}:${port}/${dbName}`);
  } else {
    host     = process.env.DB_LOCAL_HOST     ?? 'localhost';
    port     = process.env.DB_LOCAL_PORT     ?? '3306';
    user     = process.env.DB_LOCAL_USER     ?? 'root';
    password = process.env.DB_LOCAL_PASSWORD ?? '';
    dbName   = process.env.DB_LOCAL_NAME     ?? 'scholarly';
    log.log(`🏠 Mode LOCAL — connexion à ${host}:${port}/${dbName}`);
  }

  // Encodage du mot de passe (caractères spéciaux dans l'URL)
  const encodedPassword = encodeURIComponent(password);

  return `mysql://${user}:${encodedPassword}@${host}:${port}/${dbName}`;
}

/** Retourne true si on est connecté à la BD distante du prof */
export function isRemoteMode(): boolean {
  if (process.env.DATABASE_URL) return false; // override manuel = on ne sait pas
  return (process.env.DB_MODE ?? 'local').toLowerCase() === 'remote';
}
