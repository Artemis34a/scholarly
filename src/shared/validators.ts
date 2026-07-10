import { BadRequestException } from '@nestjs/common';

const AGE_MAX_ANNEES = 110;

// Rejette les dates de naissance dans le futur ou manifestement irréalistes
// (plus de 110 ans), pour les élèves comme pour les enseignants. Volontairement
// permissif sur la borne basse (pas d'âge minimum imposé) : ce n'est pas la
// règle métier en cause ici, seulement les valeurs absurdes.
export function assertDateNaissanceValide(dateNaissance: string | Date) {
  const date = new Date(dateNaissance);
  const maintenant = new Date();

  if (date > maintenant) {
    throw new BadRequestException('La date de naissance ne peut pas être dans le futur.');
  }

  const limiteAncienne = new Date();
  limiteAncienne.setFullYear(limiteAncienne.getFullYear() - AGE_MAX_ANNEES);
  if (date < limiteAncienne) {
    throw new BadRequestException(
      `La date de naissance est irréaliste (plus de ${AGE_MAX_ANNEES} ans).`,
    );
  }
}
