export const classeInitialValues = {
  libelle: '',
  idCycle: '',
}

export function createFormValues(classe) {
  if (!classe) return classeInitialValues

  return {
    libelle: classe.libelle ?? '',
    idCycle: classe.idCycle ? `${classe.idCycle}` : '',
  }
}

export function buildClassePayload(values, adminId) {
  return {
    libelle: values.libelle.trim(),
    idCycle: Number(values.idCycle),
    idAdmin: adminId ?? undefined,
  }
}

export function getCycleLabel(cycles, idCycle) {
  if (!idCycle) return 'Non renseigne'

  const cycle = cycles.find((item) => item.id === idCycle)
  return cycle?.libelle ?? `Cycle #${idCycle}`
}

export function getPrimarySalle(classe) {
  return classe?.salles?.[0] ?? null
}

export function getTitulaireName(classe) {
  const salle = getPrimarySalle(classe)
  const personne = salle?.titulaire?.personne
  return personne ? `${personne.nom} ${personne.prenom}` : 'Non affecte'
}

export function getEffectif(classe) {
  const salle = getPrimarySalle(classe)
  return salle?._count?.frequentes ?? 0
}

export function getCoursCount(classe) {
  return classe?.cours?.length ?? 0
}

export function applyClasseFilters(classes, filters, cycles) {
  return classes.filter((classe) => {
    if (filters.idCycle !== 'all' && `${classe.idCycle ?? ''}` !== filters.idCycle) {
      return false
    }

    if (filters.localSearch.trim()) {
      const needle = filters.localSearch.trim().toLowerCase()
      const cycle = getCycleLabel(cycles, classe.idCycle).toLowerCase()
      const titulaire = getTitulaireName(classe).toLowerCase()
      const haystack = [classe.libelle, cycle, titulaire]
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
