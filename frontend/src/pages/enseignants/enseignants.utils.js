export const enseignantInitialValues = {
  nom: '',
  prenom: '',
  username: '',
  password: '',
  mobile: '',
  phone: '',
  dateNaissance: '',
  lieuNaissance: '',
  idCours: '',
  idClasseTitulaire: '',
  actif: true,
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

export function getCoursLabel(coursList, idCours) {
  if (!idCours) return 'Non renseigne'

  const cours = coursList.find((item) => item.id === idCours)
  return cours?.libelle ?? `Cours #${idCours}`
}

export function createFormValues(enseignant) {
  if (!enseignant) return enseignantInitialValues

  return {
    nom: enseignant.personne?.nom ?? '',
    prenom: enseignant.personne?.prenom ?? '',
    username: enseignant.personne?.username ?? '',
    password: '',
    mobile: enseignant.personne?.mobile ?? '',
    phone: enseignant.personne?.phone ?? '',
    dateNaissance: formatDateInput(enseignant.personne?.dateNaissance),
    lieuNaissance: enseignant.personne?.lieuNaissance ?? '',
    idCours: enseignant.idCours ? `${enseignant.idCours}` : '',
    idClasseTitulaire: '',
    actif: Boolean(enseignant.actif),
  }
}

export function buildEnseignantPayload(values, adminId) {
  const payload = {
    nom: values.nom.trim(),
    prenom: values.prenom.trim(),
    username: values.username.trim(),
    mobile: values.mobile.trim() || undefined,
    phone: values.phone.trim() || undefined,
    dateNaissance: values.dateNaissance || undefined,
    lieuNaissance: values.lieuNaissance.trim() || undefined,
    idCours: Number(values.idCours),
    actif: Boolean(values.actif),
    idAdmin: adminId ?? undefined,
  }

  if (values.password && values.password.trim()) {
    payload.password = values.password.trim()
  }

  return payload
}

export function applyEnseignantFilters(enseignants, filters, coursList) {
  return enseignants.filter((enseignant) => {
    if (filters.actif !== 'all') {
      const isActive = filters.actif === 'true'
      if (Boolean(enseignant.actif) !== isActive) return false
    }

    if (filters.idCours !== 'all' && `${enseignant.idCours ?? ''}` !== filters.idCours) {
      return false
    }

    if (filters.localSearch.trim()) {
      const needle = filters.localSearch.trim().toLowerCase()
      const cours = getCoursLabel(coursList, enseignant.idCours).toLowerCase()
      const haystack = [
        enseignant.personne?.nom,
        enseignant.personne?.prenom,
        enseignant.personne?.username,
        cours,
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
