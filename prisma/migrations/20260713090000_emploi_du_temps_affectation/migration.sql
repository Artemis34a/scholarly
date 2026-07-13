-- Un créneau d'emploi du temps référençait jusqu'ici idClasse et idCours séparément,
-- sans aucune trace de l'enseignant qui assure le cours. Il référence désormais une
-- Affectation précise (enseignant + cours + classe déjà validés ensemble), ce qui
-- rend structurellement impossible d'enregistrer un cours non affecté à la classe,
-- ou un enseignant qui n'enseigne pas ce cours dans cette classe.
--
-- Migration additive-first : on ajoute la nouvelle colonne, on la remplit à partir
-- des données existantes, puis seulement ensuite on retire les anciennes colonnes.

-- 1. Nouvelle colonne, nullable le temps du backfill.
ALTER TABLE `EmploiDuTemps` ADD COLUMN `idAffectation` INTEGER NULL;

-- 2. Backfill : pour chaque créneau existant, on retrouve l'affectation
-- correspondant à son couple (classe, cours). Si plusieurs enseignants étaient
-- affectés au même cours dans la même classe, on retient la plus ancienne
-- affectation (comportement best-effort pour des données historiques ; en usage
-- normal un seul enseignant est affecté à un couple cours/classe donné).
UPDATE `EmploiDuTemps` e
SET e.`idAffectation` = (
  SELECT a.`id`
  FROM `Affectation` a
  INNER JOIN `ClasseCours` cc ON cc.`id` = a.`idClasseCours`
  WHERE cc.`idClasse` = e.`idClasse` AND cc.`idCours` = e.`idCours`
  ORDER BY a.`id` ASC
  LIMIT 1
);

-- 3. Nettoyage : un créneau dont le couple (classe, cours) n'a jamais eu
-- d'enseignant affecté n'a pas de correspondance possible et ne peut pas être
-- conservé sous la nouvelle modélisation (il était de toute façon déjà incohérent :
-- un cours programmé sans qu'aucun enseignant ne l'assure dans cette classe).
DELETE FROM `EmploiDuTemps` WHERE `idAffectation` IS NULL;

-- 4. Anciennes contraintes et index sur idClasse/idCours.
ALTER TABLE `EmploiDuTemps` DROP FOREIGN KEY `EmploiDuTemps_idClasse_fkey`;
ALTER TABLE `EmploiDuTemps` DROP FOREIGN KEY `EmploiDuTemps_idCours_fkey`;
DROP INDEX `EmploiDuTemps_idClasse_jour_heureDebut_key` ON `EmploiDuTemps`;
DROP INDEX `EmploiDuTemps_idCours_fkey` ON `EmploiDuTemps`;

-- 5. Retrait des anciennes colonnes, idAffectation devient obligatoire.
ALTER TABLE `EmploiDuTemps`
  DROP COLUMN `idClasse`,
  DROP COLUMN `idCours`,
  MODIFY `idAffectation` INTEGER NOT NULL;

-- 6. Nouvel index d'unicité et nouvelle contrainte de clé étrangère (CASCADE :
-- si l'affectation est retirée, les créneaux qui en dépendent n'ont plus de sens).
CREATE UNIQUE INDEX `EmploiDuTemps_idAffectation_jour_heureDebut_key` ON `EmploiDuTemps`(`idAffectation`, `jour`, `heureDebut`);
ALTER TABLE `EmploiDuTemps` ADD CONSTRAINT `EmploiDuTemps_idAffectation_fkey` FOREIGN KEY (`idAffectation`) REFERENCES `Affectation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
