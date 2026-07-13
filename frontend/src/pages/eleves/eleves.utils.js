export const sexeOptions = [
  { value: '1', label: 'Masculin' },
  { value: '2', label: 'Feminin' },
]

export const langueOptions = [
  'Francais',
  'Anglais',
  'Bilingue',
]

export const eleveInitialValues = {
  nom: '',
  prenom: '',
  dateNaissance: '',
  lieuNaissance: '',
  sexe: '1',
  langue: 'Francais',
  username: '',
  password: '',
  actif: true,
  idClasse: '',
}

export function getSexeLabel(value) {
  return value === 2 || value === '2' ? 'Feminin' : 'Masculin'
}

// Un eleve n'a pas de cycle stocke directement : il est deduit de la classe dans
// laquelle il est inscrit (voir EleveService.ELEVE_INCLUDE cote backend), pour
// eviter toute incoherence entre le cycle affiche et la classe reelle de l'eleve.
export function getEleveClasse(eleve) {
  return eleve?.frequentes?.[0]?.salle?.classe ?? null
}

export function getEleveCycle(eleve) {
  return getEleveClasse(eleve)?.cycle ?? null
}

export function getEleveClasseLabel(eleve) {
  return getEleveClasse(eleve)?.libelle ?? 'Non affecte'
}

export function getEleveCycleLabel(eleve) {
  return getEleveCycle(eleve)?.libelle ?? 'Non affecte'
}

export function getActifLabel(actif) {
  return actif ? 'Actif' : 'Inactif'
}

export function formatDate(value) {
  if (!value) return 'Non renseignee'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatDateInput(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toISOString().slice(0, 10)
}

export function createFormValues(eleve) {
  if (!eleve) return eleveInitialValues

  return {
    nom: eleve.nom ?? '',
    prenom: eleve.prenom ?? '',
    dateNaissance: formatDateInput(eleve.dateNaissance),
    lieuNaissance: eleve.lieuNaissance ?? '',
    sexe: `${eleve.sexe ?? 1}`,
    langue: eleve.langue ?? 'Francais',
    username: eleve.username ?? '',
    password: '',
    actif: Boolean(eleve.actif),
    idClasse: '',
  }
}

export function buildElevePayload(values, adminId) {
  const payload = {
    nom: values.nom.trim(),
    prenom: values.prenom.trim(),
    dateNaissance: values.dateNaissance,
    lieuNaissance: values.lieuNaissance.trim(),
    sexe: Number(values.sexe),
    langue: values.langue.trim(),
    username: values.username.trim(),
    actif: Boolean(values.actif),
    idAdmin: adminId ?? undefined,
  }

  if (values.password && values.password.trim()) {
    payload.password = values.password.trim()
  }

  return payload
}

export function applyEleveFilters(eleves, filters) {
  return eleves.filter((eleve) => {
    if (filters.actif !== 'all') {
      const isActive = filters.actif === 'true'
      if (Boolean(eleve.actif) !== isActive) return false
    }

    if (filters.sexe !== 'all' && `${eleve.sexe}` !== filters.sexe) {
      return false
    }

    if (filters.langue !== 'all' && eleve.langue !== filters.langue) {
      return false
    }

    if (filters.idCycle !== 'all' && `${getEleveCycle(eleve)?.id ?? ''}` !== filters.idCycle) {
      return false
    }

    if (filters.localSearch.trim()) {
      const needle = filters.localSearch.trim().toLowerCase()
      const cycle = getEleveCycleLabel(eleve).toLowerCase()
      const classe = getEleveClasseLabel(eleve).toLowerCase()
      const haystack = [
        eleve.nom,
        eleve.prenom,
        eleve.lieuNaissance,
        eleve.langue,
        cycle,
        classe,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (!haystack.includes(needle)) {
        return false
      }
    }

    return true
  })
}
