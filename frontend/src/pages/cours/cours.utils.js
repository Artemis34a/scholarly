export const coursInitialValues = {
  libelle: '',
  coefficient: '1',
  note: '',
  idClasse: '',
  description: '',
  actif: true,
}

export function createFormValues(cours) {
  if (!cours) return coursInitialValues

  return {
    libelle: cours.libelle ?? '',
    coefficient: cours.coefficient !== undefined && cours.coefficient !== null ? `${cours.coefficient}` : '1',
    note: cours.note !== undefined && cours.note !== null ? `${cours.note}` : '',
    idClasse: cours.idClasse ? `${cours.idClasse}` : '',
    description: cours.description ?? '',
    actif: Boolean(cours.actif),
  }
}

export function buildCoursPayload(values, adminId) {
  return {
    libelle: values.libelle.trim(),
    coefficient: Number(values.coefficient),
    note: values.note.trim() ? Number(values.note) : undefined,
    idClasse: Number(values.idClasse),
    description: values.description.trim() || undefined,
    actif: Boolean(values.actif),
    idAdmin: adminId ?? undefined,
  }
}

export function getClasseLabel(classes, idClasse) {
  if (!idClasse) return 'Non renseignee'

  const classe = classes.find((item) => item.id === idClasse)
  return classe?.libelle ?? `Classe #${idClasse}`
}

export function getEnseignantsNames(cours) {
  if (!cours?.enseignants || cours.enseignants.length === 0) return 'Aucun enseignant'

  return cours.enseignants
    .map((enseignant) => `${enseignant.personne?.nom} ${enseignant.personne?.prenom}`)
    .join(', ')
}

export function applyCoursFilters(coursList, filters, classes) {
  return coursList.filter((cours) => {
    if (filters.actif !== 'all') {
      const isActive = filters.actif === 'true'
      if (Boolean(cours.actif) !== isActive) return false
    }

    if (filters.idClasse !== 'all' && `${cours.idClasse ?? ''}` !== filters.idClasse) {
      return false
    }

    if (filters.localSearch.trim()) {
      const needle = filters.localSearch.trim().toLowerCase()
      const classe = getClasseLabel(classes, cours.idClasse).toLowerCase()
      const enseignants = getEnseignantsNames(cours).toLowerCase()
      const haystack = [cours.libelle, cours.description, classe, enseignants]
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
