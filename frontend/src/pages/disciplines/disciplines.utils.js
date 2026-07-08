export const graviteOptions = [
  { value: '1', label: '1 - Leger' },
  { value: '2', label: '2 - Moyen' },
  { value: '3', label: '3 - Grave' },
  { value: '4', label: '4 - Tres grave' },
]

export function getGraviteLabel(gravite) {
  const option = graviteOptions.find((item) => item.value === `${gravite}`)
  return option?.label ?? `Niveau ${gravite}`
}

export const statutOptions = [
  { value: 'OUVERT', label: 'Ouvert' },
  { value: 'EN_TRAITEMENT', label: 'En traitement' },
  { value: 'RESOLU', label: 'Resolu' },
  { value: 'FERME', label: 'Ferme' },
]

export function getStatutLabel(statut) {
  return statutOptions.find((item) => item.value === statut)?.label ?? statut
}

export function getStatutColor(statut) {
  switch (statut) {
    case 'OUVERT':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
    case 'EN_TRAITEMENT':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
    case 'RESOLU':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
    case 'FERME':
      return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
    default:
      return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'
  }
}

export const disciplineInitialValues = {
  libelle: '',
  description: '',
  estFaute: true,
  gravite: '1',
  sanctionType: '',
  actif: true,
}

export function createDisciplineFormValues(discipline) {
  if (!discipline) return disciplineInitialValues

  return {
    libelle: discipline.libelle ?? '',
    description: discipline.description ?? '',
    estFaute: Boolean(discipline.estFaute),
    gravite: discipline.gravite ? `${discipline.gravite}` : '1',
    sanctionType: discipline.sanctionType ?? '',
    actif: Boolean(discipline.actif),
  }
}

export function buildDisciplinePayload(values) {
  return {
    libelle: values.libelle.trim(),
    description: values.description.trim() || undefined,
    estFaute: Boolean(values.estFaute),
    gravite: Number(values.gravite),
    sanctionType: values.sanctionType.trim() || undefined,
    actif: Boolean(values.actif),
  }
}

export function formatDate(value) {
  if (!value) return 'Non renseignee'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatDateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 16)
}

export const rapportInitialValues = {
  idEleve: '',
  idDiscipline: '',
  idAuteur: '',
  dateRapport: '',
  description: '',
  temoins: '',
  sanctionAppliquee: '',
  statut: 'OUVERT',
}

export function createRapportFormValues(rapport) {
  if (!rapport) return rapportInitialValues

  return {
    idEleve: rapport.idEleve ? `${rapport.idEleve}` : '',
    idDiscipline: rapport.idDiscipline ? `${rapport.idDiscipline}` : '',
    idAuteur: rapport.idAuteur ? `${rapport.idAuteur}` : '',
    dateRapport: formatDateInput(rapport.dateRapport),
    description: rapport.description ?? '',
    temoins: rapport.temoins ?? '',
    sanctionAppliquee: rapport.sanctionAppliquee ?? '',
    statut: rapport.statut ?? 'OUVERT',
  }
}

export function buildRapportPayload(values) {
  return {
    idEleve: Number(values.idEleve),
    idDiscipline: Number(values.idDiscipline),
    idAuteur: Number(values.idAuteur),
    dateRapport: values.dateRapport ? new Date(values.dateRapport).toISOString() : undefined,
    description: values.description.trim(),
    temoins: values.temoins.trim() || undefined,
    sanctionAppliquee: values.sanctionAppliquee.trim() || undefined,
    statut: values.statut,
  }
}

export function getDisciplineLabel(disciplinesList, idDiscipline) {
  if (!idDiscipline) return 'Non renseignee'
  const discipline = disciplinesList.find((item) => item.id === idDiscipline)
  return discipline?.libelle ?? `Discipline #${idDiscipline}`
}

export function applyDisciplineFilters(disciplinesList, filters) {
  return disciplinesList.filter((discipline) => {
    if (filters.estFaute !== 'all') {
      const isFaute = filters.estFaute === 'true'
      if (Boolean(discipline.estFaute) !== isFaute) return false
    }

    if (filters.gravite !== 'all' && `${discipline.gravite}` !== filters.gravite) {
      return false
    }

    if (filters.localSearch.trim()) {
      const needle = filters.localSearch.trim().toLowerCase()
      const haystack = [discipline.libelle, discipline.description, discipline.sanctionType]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(needle)) return false
    }

    return true
  })
}
