export const typeEpreuveOptions = [
  { value: 'CONTROLE', label: 'Controle' },
  { value: 'EXAMEN', label: 'Examen' },
]

export function getTypeEpreuveLabel(typeEpreuve) {
  const option = typeEpreuveOptions.find((item) => item.value === typeEpreuve)
  return option?.label ?? 'Non renseigne'
}

export const epreuveInitialValues = {
  libelle: '',
  description: '',
  typeEpreuve: 'CONTROLE',
  idClasse: '',
  idClasseCours: '',
  dateEpreuve: '',
  duree: '',
  coefficient: '1',
  noteMax: '20',
  actif: true,
}

export function formatDate(value) {
  if (!value) return 'Non renseignee'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatDateTimeInput(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toISOString().slice(0, 16)
}

export function createEpreuveFormValues(epreuve) {
  if (!epreuve) return epreuveInitialValues

  return {
    libelle: epreuve.libelle ?? '',
    description: epreuve.description ?? '',
    typeEpreuve: epreuve.typeEpreuve ?? 'CONTROLE',
    idClasse: epreuve.idClasse ? `${epreuve.idClasse}` : '',
    idClasseCours: epreuve.idClasseCours ? `${epreuve.idClasseCours}` : '',
    dateEpreuve: formatDateTimeInput(epreuve.dateEpreuve),
    duree: epreuve.duree !== undefined && epreuve.duree !== null ? `${epreuve.duree}` : '',
    coefficient: epreuve.coefficient !== undefined && epreuve.coefficient !== null ? `${epreuve.coefficient}` : '1',
    noteMax: epreuve.noteMax !== undefined && epreuve.noteMax !== null ? `${epreuve.noteMax}` : '20',
    actif: Boolean(epreuve.actif),
  }
}

export function buildEpreuvePayload(values, adminId) {
  return {
    libelle: values.libelle.trim(),
    description: values.description.trim() || undefined,
    typeEpreuve: values.typeEpreuve,
    idClasse: Number(values.idClasse),
    idClasseCours: values.idClasseCours ? Number(values.idClasseCours) : undefined,
    dateEpreuve: values.dateEpreuve ? new Date(values.dateEpreuve).toISOString() : undefined,
    duree: values.duree ? Number(values.duree) : undefined,
    coefficient: Number(values.coefficient),
    noteMax: Number(values.noteMax),
    actif: Boolean(values.actif),
    idAdmin: adminId ?? undefined,
  }
}

export function getCoursLabel(coursList, idCours) {
  if (!idCours) return 'Aucun cours'
  const cours = coursList.find((item) => item.id === idCours)
  return cours?.libelle ?? `Cours #${idCours}`
}

// Le cours et la classe d'une épreuve sont désormais exposés par le backend via
// epreuve.classe (obligatoire) et epreuve.classeCours.cours (optionnel), plutôt
// qu'un simple idCours : un même cours pouvant être enseigné dans plusieurs
// classes, l'épreuve doit préciser explicitement la classe concernée.
export function getEpreuveClasseLabel(epreuve) {
  return epreuve?.classe?.libelle ?? 'Non renseignee'
}

export function getEpreuveCoursLabel(epreuve) {
  return epreuve?.classeCours?.cours?.libelle ?? 'Aucun cours'
}

// Enseignant proprietaire de l'epreuve (voir Epreuve.idEnseignant) : c'est la
// reponse a "quel enseignant a cree cette epreuve", visible cote administrateur.
export function getEpreuveEnseignantLabel(epreuve) {
  const personne = epreuve?.enseignant?.personne
  if (!personne) return 'Administration'
  return `${personne.nom} ${personne.prenom}`
}

export function applyEpreuveFilters(epreuvesList, filters) {
  return epreuvesList.filter((epreuve) => {
    if (filters.typeEpreuve !== 'all' && epreuve.typeEpreuve !== filters.typeEpreuve) {
      return false
    }

    if (filters.idClasse !== 'all' && `${epreuve.idClasse ?? ''}` !== filters.idClasse) {
      return false
    }

    if (filters.localSearch.trim()) {
      const needle = filters.localSearch.trim().toLowerCase()
      const type = getTypeEpreuveLabel(epreuve.typeEpreuve).toLowerCase()
      const classe = getEpreuveClasseLabel(epreuve).toLowerCase()
      const cours = getEpreuveCoursLabel(epreuve).toLowerCase()
      const haystack = [epreuve.libelle, epreuve.description, type, classe, cours]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      if (!haystack.includes(needle)) return false
    }

    return true
  })
}

export const evaluationInitialValues = {
  idEpreuve: '',
  idEleve: '',
  note: '',
  appreciation: '',
  commentaire: '',
}

export function createEvaluationFormValues(evaluation) {
  if (!evaluation) return evaluationInitialValues

  return {
    idEpreuve: evaluation.idEpreuve ? `${evaluation.idEpreuve}` : '',
    idEleve: evaluation.idEleve ? `${evaluation.idEleve}` : '',
    note: evaluation.note !== undefined && evaluation.note !== null ? `${evaluation.note}` : '',
    appreciation: evaluation.appreciation ?? '',
    commentaire: evaluation.commentaire ?? '',
  }
}

export function buildEvaluationPayload(values) {
  return {
    idEpreuve: Number(values.idEpreuve),
    idEleve: Number(values.idEleve),
    note: values.note.trim() ? Number(values.note) : undefined,
    appreciation: values.appreciation.trim() || undefined,
    commentaire: values.commentaire.trim() || undefined,
  }
}

export function getEleveLabel(eleve) {
  if (!eleve) return 'Eleve inconnu'
  return `${eleve.nom} ${eleve.prenom}`
}

export function getEpreuveLabel(epreuvesList, idEpreuve) {
  if (!idEpreuve) return 'Epreuve inconnue'
  const epreuve = epreuvesList.find((item) => item.id === idEpreuve)
  return epreuve?.libelle ?? `Epreuve #${idEpreuve}`
}
