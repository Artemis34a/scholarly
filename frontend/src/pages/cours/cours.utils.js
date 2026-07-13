export const coursInitialValues = {
  libelle: '',
  coefficient: '1',
  note: '',
  idClasses: [],
  description: '',
  actif: true,
}

export function createFormValues(cours) {
  if (!cours) return coursInitialValues

  return {
    libelle: cours.libelle ?? '',
    coefficient: cours.coefficient !== undefined && cours.coefficient !== null ? `${cours.coefficient}` : '1',
    note: cours.note !== undefined && cours.note !== null ? `${cours.note}` : '',
    idClasses: (cours.classesCours ?? []).map((classeCours) => `${classeCours.idClasse}`),
    description: cours.description ?? '',
    actif: Boolean(cours.actif),
  }
}

export function buildCoursPayload(values, adminId) {
  return {
    libelle: values.libelle.trim(),
    coefficient: Number(values.coefficient),
    note: values.note.trim() ? Number(values.note) : undefined,
    idClasses: values.idClasses.map(Number),
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

// Un cours peut desormais etre enseigne dans plusieurs classes : on affiche donc
// la liste complete des classes rattachees (via classesCours) plutot qu'une seule.
export function getClassesLabels(cours) {
  const classesCours = cours?.classesCours ?? []
  if (classesCours.length === 0) return 'Aucune classe'

  return classesCours.map((classeCours) => classeCours.classe?.libelle).filter(Boolean).join(', ')
}

// Les enseignants sont rattaches a une combinaison cours/classe (Affectation sur
// ClasseCours) : on agrege ici les affectations de toutes les classes du cours,
// en dedupliquant par enseignant.
export function getEnseignantsNames(cours) {
  const classesCours = cours?.classesCours ?? []
  const noms = new Map()

  classesCours.forEach((classeCours) => {
    (classeCours.affectations ?? []).forEach((affectation) => {
      const enseignant = affectation.enseignant
      if (enseignant) {
        noms.set(enseignant.id, `${enseignant.personne?.nom ?? ''} ${enseignant.personne?.prenom ?? ''}`.trim())
      }
    })
  })

  if (noms.size === 0) return 'Aucun enseignant'
  return Array.from(noms.values()).join(', ')
}

export function applyCoursFilters(coursList, filters) {
  return coursList.filter((cours) => {
    if (filters.actif !== 'all') {
      const isActive = filters.actif === 'true'
      if (Boolean(cours.actif) !== isActive) return false
    }

    if (filters.idClasse !== 'all') {
      const appartientALaClasse = (cours.classesCours ?? []).some(
        (classeCours) => `${classeCours.idClasse}` === filters.idClasse,
      )
      if (!appartientALaClasse) return false
    }

    if (filters.localSearch.trim()) {
      const needle = filters.localSearch.trim().toLowerCase()
      const classes = getClassesLabels(cours).toLowerCase()
      const enseignants = getEnseignantsNames(cours).toLowerCase()
      const haystack = [cours.libelle, cours.description, classes, enseignants]
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
