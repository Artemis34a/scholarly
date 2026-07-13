// Un enseignant est identifie par son Personne.id (user.id du JWT). Ce qu'il
// enseigne (et ou) est derive des Affectation deja incluses dans chaque cours
// (cours.classesCours[].affectations[].enseignant.personne.id), sans nouvel
// endpoint backend : un cours pouvant etre enseigne dans plusieurs classes, on
// ne peut plus se contenter de regarder cours.enseignants comme avant.

export function getMesAffectations(coursList, personneId) {
  const result = []
  for (const cours of coursList) {
    for (const classeCours of cours.classesCours ?? []) {
      const estAffecte = classeCours.affectations?.some((a) => a.enseignant?.personne?.id === personneId)
      if (estAffecte) {
        result.push({
          idClasseCours: classeCours.id,
          idClasse: classeCours.idClasse,
          classe: classeCours.classe,
          cours,
        })
      }
    }
  }
  return result
}

export function getMesCours(coursList, personneId) {
  const seen = new Set()
  const result = []
  for (const cours of coursList) {
    const estAffecte = (cours.classesCours ?? []).some((classeCours) =>
      classeCours.affectations?.some((a) => a.enseignant?.personne?.id === personneId),
    )
    if (estAffecte && !seen.has(cours.id)) {
      seen.add(cours.id)
      result.push(cours)
    }
  }
  return result
}

export function estTitulaireDeClasse(classe, personneId) {
  return classe.salles?.some((salle) => salle.titulaire?.personne?.id === personneId) ?? false
}

// mesCours : resultat de getMesCours(coursList, personneId) — chaque cours porte
// deja ses classesCours/affectations, inutile de redemander coursList.
export function getMesClasses(classesList, mesCours, personneId) {
  const mesClasseIds = new Set()
  for (const cours of mesCours) {
    for (const classeCours of cours.classesCours ?? []) {
      if (classeCours.affectations?.some((a) => a.enseignant?.personne?.id === personneId)) {
        mesClasseIds.add(classeCours.idClasse)
      }
    }
  }
  return classesList.filter((classe) => estTitulaireDeClasse(classe, personneId) || mesClasseIds.has(classe.id))
}
