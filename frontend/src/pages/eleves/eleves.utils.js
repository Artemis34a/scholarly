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

export function getVilleLabel(villes, idVilleNaissance) {
  if (!idVilleNaissance) return 'Non renseignee'

  const ville = villes.find((item) => item.id === idVilleNaissance)
  return ville?.libelle ?? `Ville #${idVilleNaissance}`
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

export function applyEleveFilters(eleves, filters, villes) {
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

    if (filters.ville !== 'all' && `${eleve.idVilleNaissance ?? ''}` !== filters.ville) {
      return false
    }

    if (filters.localSearch.trim()) {
      const needle = filters.localSearch.trim().toLowerCase()
      const ville = getVilleLabel(villes, eleve.idVilleNaissance).toLowerCase()
      const haystack = [
        eleve.nom,
        eleve.prenom,
        eleve.lieuNaissance,
        eleve.langue,
        ville,
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
