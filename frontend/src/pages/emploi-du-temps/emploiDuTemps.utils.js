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
    idSalle: values.idSalle ? Number(values.idSalle) : undefined,
    actif: Boolean(values.actif),
  }
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
