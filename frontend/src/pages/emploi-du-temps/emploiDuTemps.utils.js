export const joursSemaine = [
  { value: 'LUNDI', label: 'Lundi' },
  { value: 'MARDI', label: 'Mardi' },
  { value: 'MERCREDI', label: 'Mercredi' },
  { value: 'JEUDI', label: 'Jeudi' },
  { value: 'VENDREDI', label: 'Vendredi' },
  { value: 'SAMEDI', label: 'Samedi' },
]

export function getJourLabel(jour) {
  return joursSemaine.find((item) => item.value === jour)?.label ?? jour
}

export const emploiInitialValues = {
  jour: 'LUNDI',
  heureDebut: '',
  heureFin: '',
  idClasse: '',
  idCours: '',
  idEnseignant: '',
  idSalle: '',
  actif: true,
}

export function createEmploiFormValues(emploi) {
  if (!emploi) return emploiInitialValues

  return {
    jour: emploi.jour ?? 'LUNDI',
    heureDebut: emploi.heureDebut ?? '',
    heureFin: emploi.heureFin ?? '',
    idClasse: emploi.idClasse ? `${emploi.idClasse}` : '',
    idCours: emploi.idCours ? `${emploi.idCours}` : '',
    idEnseignant: emploi.idEnseignant ? `${emploi.idEnseignant}` : '',
    idSalle: emploi.idSalle ? `${emploi.idSalle}` : '',
    actif: Boolean(emploi.actif),
  }
}

export function buildEmploiPayload(values) {
  return {
    jour: values.jour,
    heureDebut: values.heureDebut,
    heureFin: values.heureFin,
    idClasse: Number(values.idClasse),
    idCours: Number(values.idCours),
    idEnseignant: Number(values.idEnseignant),
    idSalle: values.idSalle ? Number(values.idSalle) : undefined,
    actif: Boolean(values.actif),
  }
}

// Un cours n'est proposable pour une classe que s'il lui est réellement affecté
// (ClasseCours) : coursList doit porter cours.classesCours (voir coursService).
export function getCoursOptionsPourClasse(coursList, idClasse) {
  if (!idClasse) return []
  return coursList.filter((cours) =>
    (cours.classesCours ?? []).some((cc) => `${cc.idClasse}` === `${idClasse}`),
  )
}

// Un enseignant n'est proposable pour un créneau que s'il est réellement affecté
// à ce cours, dans cette classe précise (Affectation, via ClasseCours.affectations).
export function getEnseignantsPourCoursClasse(coursList, idCours, idClasse) {
  if (!idCours || !idClasse) return []
  const cours = coursList.find((item) => `${item.id}` === `${idCours}`)
  const classeCours = cours?.classesCours?.find((cc) => `${cc.idClasse}` === `${idClasse}`)
  return (classeCours?.affectations ?? []).map((affectation) => affectation.enseignant)
}

// Regroupe une liste de creneaux par jour, pour l'affichage en grille hebdomadaire.
export function groupByJour(slots) {
  const map = new Map(joursSemaine.map((jour) => [jour.value, []]))

  slots.forEach((slot) => {
    if (!map.has(slot.jour)) map.set(slot.jour, [])
    map.get(slot.jour).push(slot)
  })

  for (const list of map.values()) {
    list.sort((a, b) => a.heureDebut.localeCompare(b.heureDebut))
  }

  return map
}
