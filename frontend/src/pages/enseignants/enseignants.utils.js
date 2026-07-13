export const enseignantInitialValues = {
  nom: '',
  prenom: '',
  username: '',
  password: '',
  mobile: '',
  phone: '',
  dateNaissance: '',
  lieuNaissance: '',
  idClasseCours: '',
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

// Un enseignant enseigne un cours dans une classe precise : l'unite affectable
// est donc le couple cours/classe (ClasseCours), pas le cours seul.
export function getClasseCoursOptions(coursList) {
  return coursList.flatMap((cours) =>
    (cours.classesCours ?? []).map((classeCours) => ({
      value: `${classeCours.id}`,
      label: `${cours.libelle} - ${classeCours.classe?.libelle ?? 'Classe inconnue'}`,
    })),
  )
}

export function getAffectationsLabel(enseignant) {
  const affectations = enseignant?.affectations ?? []
  if (affectations.length === 0) return 'Aucune affectation'

  return affectations
    .map((affectation) => {
      const cours = affectation.classeCours?.cours?.libelle ?? 'Cours inconnu'
      const classe = affectation.classeCours?.classe?.libelle ?? 'Classe inconnue'
      return `${cours} (${classe})`
    })
    .join(', ')
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
    idClasseCours: '',
    actif: Boolean(enseignant.actif),
  }
}

// L'affectation initiale (idClasseCours) n'est envoyee qu'a la creation : les
// affectations se gerent ensuite exclusivement via les endpoints dedies
// (ajout/retrait), jamais depuis la mise a jour des informations personnelles.
export function buildEnseignantPayload(values, adminId, isCreate) {
  const payload = {
    nom: values.nom.trim(),
    prenom: values.prenom.trim(),
    username: values.username.trim(),
    mobile: values.mobile.trim() || undefined,
    phone: values.phone.trim() || undefined,
    dateNaissance: values.dateNaissance || undefined,
    lieuNaissance: values.lieuNaissance.trim() || undefined,
    actif: Boolean(values.actif),
    idAdmin: adminId ?? undefined,
  }

  if (isCreate) {
    payload.idClasseCours = Number(values.idClasseCours)
  }

  if (values.password && values.password.trim()) {
    payload.password = values.password.trim()
  }

  return payload
}

export function applyEnseignantFilters(enseignants, filters) {
  return enseignants.filter((enseignant) => {
    if (filters.actif !== 'all') {
      const isActive = filters.actif === 'true'
      if (Boolean(enseignant.actif) !== isActive) return false
    }

    if (filters.idClasse !== 'all') {
      const enseigneDansLaClasse = (enseignant.affectations ?? []).some(
        (affectation) => `${affectation.classeCours?.idClasse}` === filters.idClasse,
      )
      if (!enseigneDansLaClasse) return false
    }

    if (filters.localSearch.trim()) {
      const needle = filters.localSearch.trim().toLowerCase()
      const affectations = getAffectationsLabel(enseignant).toLowerCase()
      const haystack = [
        enseignant.personne?.nom,
        enseignant.personne?.prenom,
        enseignant.personne?.username,
        affectations,
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
