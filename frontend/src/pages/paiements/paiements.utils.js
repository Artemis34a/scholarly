export function formatMontant(value) {
  if (value === null || value === undefined) return '-'
  return `${new Intl.NumberFormat('fr-FR').format(value)} FCFA`
}

export function formatDate(value) {
  if (!value) return 'Non renseignee'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

export function formatDateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export const statutOptions = [
  { value: 'IMPAYE', label: 'Impaye' },
  { value: 'PARTIEL', label: 'Partiellement paye' },
  { value: 'COMPLET', label: 'Paye' },
]

export function getStatutLabel(statut) {
  return statutOptions.find((item) => item.value === statut)?.label ?? statut
}

export function getStatutColor(statut) {
  switch (statut) {
    case 'COMPLET':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
    case 'PARTIEL':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
    case 'IMPAYE':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
    default:
      return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
  }
}

// ── Mode de paiement ─────────────────────────────────────────────
export const modeInitialValues = { libelle: '', description: '', actif: true }

export function createModeFormValues(mode) {
  if (!mode) return modeInitialValues
  return {
    libelle: mode.libelle ?? '',
    description: mode.description ?? '',
    actif: Boolean(mode.actif),
  }
}

export function buildModePayload(values) {
  return {
    libelle: values.libelle.trim(),
    description: values.description.trim() || undefined,
    actif: Boolean(values.actif),
  }
}

// ── Tranche ──────────────────────────────────────────────────────
export const trancheInitialValues = { libelle: '', description: '', montant: '', echeance: '', ordre: '1' }

export function createTrancheFormValues(tranche) {
  if (!tranche) return trancheInitialValues
  return {
    libelle: tranche.libelle ?? '',
    description: tranche.description ?? '',
    montant: tranche.montant !== undefined ? `${tranche.montant}` : '',
    echeance: formatDateInput(tranche.echeance),
    ordre: tranche.ordre !== undefined ? `${tranche.ordre}` : '1',
  }
}

export function buildTranchePayload(values) {
  return {
    libelle: values.libelle.trim(),
    description: values.description.trim() || undefined,
    montant: Number(values.montant),
    echeance: values.echeance,
    ordre: Number(values.ordre),
  }
}

// ── Scolarite ────────────────────────────────────────────────────
export const statutScolariteOptions = [
  { value: 'ACTIF', label: 'Actif' },
  { value: 'TRANSFERE', label: 'Transfere' },
  { value: 'EXCLU', label: 'Exclu' },
  { value: 'ABANDON', label: 'Abandon' },
]

export const scolariteInitialValues = {
  idEleve: '',
  idAnneeAcademique: '',
  idClasse: '',
  statut: 'ACTIF',
  dateInscription: '',
  fraisInscription: '0',
  fraisScolarite: '0',
  reduction: '0',
  observations: '',
}

export function createScolariteFormValues(scolarite) {
  if (!scolarite) return scolariteInitialValues
  return {
    idEleve: scolarite.idEleve ? `${scolarite.idEleve}` : '',
    idAnneeAcademique: scolarite.idAnneeAcademique ? `${scolarite.idAnneeAcademique}` : '',
    idClasse: scolarite.idClasse ? `${scolarite.idClasse}` : '',
    statut: scolarite.statut ?? 'ACTIF',
    dateInscription: formatDateInput(scolarite.dateInscription),
    fraisInscription: scolarite.fraisInscription !== undefined ? `${scolarite.fraisInscription}` : '0',
    fraisScolarite: scolarite.fraisScolarite !== undefined ? `${scolarite.fraisScolarite}` : '0',
    reduction: scolarite.reduction !== undefined ? `${scolarite.reduction}` : '0',
    observations: scolarite.observations ?? '',
  }
}

export function buildScolaritePayload(values) {
  return {
    idEleve: Number(values.idEleve),
    idAnneeAcademique: Number(values.idAnneeAcademique),
    idClasse: Number(values.idClasse),
    statut: values.statut,
    dateInscription: values.dateInscription || undefined,
    fraisInscription: Number(values.fraisInscription),
    fraisScolarite: Number(values.fraisScolarite),
    reduction: Number(values.reduction),
    observations: values.observations.trim() || undefined,
  }
}

// ── Paiement ─────────────────────────────────────────────────────
export const paiementInitialValues = {
  idScolarite: '',
  idTranche: '',
  idModePaiement: '',
  montant: '',
  datePaiement: '',
  reference: '',
  commentaire: '',
  recuNumero: '',
}

export function createPaiementFormValues(paiement) {
  if (!paiement) return paiementInitialValues
  return {
    idScolarite: paiement.idScolarite ? `${paiement.idScolarite}` : '',
    idTranche: paiement.idTranche ? `${paiement.idTranche}` : '',
    idModePaiement: paiement.idModePaiement ? `${paiement.idModePaiement}` : '',
    montant: paiement.montant !== undefined ? `${paiement.montant}` : '',
    datePaiement: formatDateInput(paiement.datePaiement),
    reference: paiement.reference ?? '',
    commentaire: paiement.commentaire ?? '',
    recuNumero: paiement.recuNumero ?? '',
  }
}

export function buildPaiementPayload(values, adminId) {
  return {
    idScolarite: Number(values.idScolarite),
    idTranche: values.idTranche ? Number(values.idTranche) : undefined,
    idModePaiement: Number(values.idModePaiement),
    montant: Number(values.montant),
    datePaiement: values.datePaiement ? new Date(values.datePaiement).toISOString() : undefined,
    reference: values.reference.trim() || undefined,
    commentaire: values.commentaire.trim() || undefined,
    recuNumero: values.recuNumero.trim() || undefined,
    idAdmin: adminId ?? undefined,
  }
}

export function getScolariteLabel(scolarite) {
  if (!scolarite) return 'Scolarite inconnue'
  return `${scolarite.eleve?.nom} ${scolarite.eleve?.prenom} - ${scolarite.anneeAcademique?.libelle}`
}
