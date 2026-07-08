// Un enseignant est identifie par son Personne.id (user.id du JWT). Les cours et
// classes "a lui" sont derives des relations deja existantes (Enseignant.idPers,
// Titulaire.idPers), sans nouvel endpoint backend.

export function getMesCours(coursList, personneId) {
  return coursList.filter((cours) => cours.enseignants?.some((e) => e.personne?.id === personneId))
}

export function estTitulaireDeClasse(classe, personneId) {
  return classe.salles?.some((salle) => salle.titulaire?.personne?.id === personneId) ?? false
}

export function getMesClasses(classesList, mesCours, personneId) {
  const mesClasseIds = new Set(mesCours.map((cours) => cours.idClasse))
  return classesList.filter((classe) => estTitulaireDeClasse(classe, personneId) || mesClasseIds.has(classe.id))
}
