/**
 * database.config.ts
 *
 * Construit l'URL de connexion Prisma pour MySQL à partir de
 * DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME.
 *
 * DATABASE_URL (si présente dans .env) reste prioritaire sur tout.
 */

import { Logger } from '@nestjs/common';

const log = new Logger('DatabaseConfig');

export function buildDatabaseUrl(): string {
  // Override manuel — si DATABASE_URL est renseignée dans .env, on l'utilise directement
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DB_HOST ?? 'localhost';
  const port = process.env.DB_PORT ?? '3306';
  const user = process.env.DB_USER ?? 'root';
  const password = process.env.DB_PASSWORD ?? '';
  const dbName = process.env.DB_NAME ?? 'ecole_db';

  log.log(`🔌 Connexion MySQL — ${host}:${port}/${dbName}`);

  // Encodage du mot de passe (caractères spéciaux dans l'URL)
  const encodedPassword = encodeURIComponent(password);

  return `mysql://${user}:${encodedPassword}@${host}:${port}/${dbName}`;
}

/**
 * Le mode "base distante en lecture seule" (ancien DB_MODE=remote) a été retiré
 * lors du passage à MySQL standard : il n'existe plus qu'un seul mode de connexion.
 * Conservé pour compatibilité avec ReadOnlyGuard, qui reste inutilisé (non appliqué
 * sur un controller) mais ne bloque donc jamais aucune écriture.
 */
export function isRemoteMode(): boolean {
  return false;
}
