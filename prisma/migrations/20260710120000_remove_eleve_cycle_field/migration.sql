-- The student's cycle is derived from their enrolled Classe (Eleve -> Frequente ->
-- Salle -> Classe -> Cycle) rather than stored redundantly on Eleve, to avoid any
-- possible inconsistency between a student's cycle and the class they belong to.
ALTER TABLE `Eleve` DROP COLUMN `cycle`;
