/**
 * Shared interfaces and types for the École Primaire application
 */

// ============================================================
// User & Authentication Types
// ============================================================

export interface JwtPayload {
  sub: number;
  username: string;
  role: string;
}

export interface AuthenticatedUser {
  id: number;
  username: string;
  role: string;
}

// ============================================================
// Personne Types
// ============================================================

export enum TypePersonne {
  DIRECTEUR = 'DIRECTEUR',
  ENSEIGNANT = 'ENSEIGNANT',
  PARENT = 'PARENT',
}

export const TYPE_PERSONNE_CODES = {
  ELEVE: 1,
  ENSEIGNANT: 2,
  PARENT: 3,
  ADMIN: 4,
} as const;

export type TypePersonneCode =
  (typeof TYPE_PERSONNE_CODES)[keyof typeof TYPE_PERSONNE_CODES];

// ============================================================
// Pagination Types
// ============================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// Response Types
// ============================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
}

// ============================================================
// Financial Types (Scolarite → Tranches → Paiement)
// ============================================================

export enum StatutPaiement {
  EN_ATTENTE = 'EN_ATTENTE',
  PARTIEL = 'PARTIEL',
  COMPLET = 'COMPLET',
  RETARD = 'RETARD',
  EXONERE = 'EXONERE',
}

export enum ModePaiement {
  ESPECES = 'ESPECES',
  CHEQUE = 'CHEQUE',
  VIREMENT = 'VIREMENT',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CARTE = 'CARTE',
}

// ============================================================
// Academic Types
// ============================================================

export enum StatutEvaluation {
  PREVUE = 'PREVUE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE',
}

export enum TypeEpreuve {
  COMPOSITION = 'COMPOSITION',
  INTERROGATION = 'INTERROGATION',
  DEVOIR = 'DEVOIR',
  EXAMEN = 'EXAMEN',
  LECON = 'LECON',
}

// ============================================================
// Discipline Types
// ============================================================

export enum GraviteFaute {
  LEGERE = 'LEGERE',
  MOYENNE = 'MOYENNE',
  GRAVE = 'GRAVE',
  TRES_GRAVE = 'TRES_GRAVE',
}

export enum StatutRapport {
  OUVERT = 'OUVERT',
  EN_TRAITEMENT = 'EN_TRAITEMENT',
  RESOLU = 'RESOLU',
  FERME = 'FERME',
}

// ============================================================
// Message Types
// ============================================================

export enum TypeMessage {
  GENERAL = 'GENERAL',
  URGENT = 'URGENT',
  INFORMATION = 'INFORMATION',
  CONVOCATION = 'CONVOCATION',
  REMONTRANCE = 'REMONTRANCE',
  FELICITATION = 'FELICITATION',
}

export enum StatutMessage {
  BROUILLON = 'BROUILLON',
  ENVOYE = 'ENVOYE',
  LU = 'LU',
  NON_LU = 'NON_LU',
}
