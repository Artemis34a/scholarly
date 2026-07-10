-- Remodélisation : un Cours peut désormais être enseigné dans plusieurs Classes
-- (table de jonction ClasseCours), et un Enseignant peut avoir plusieurs
-- affectations d'enseignement (table Affectation), indépendamment du titulariat
-- (modèle Titulaire, non modifié). Migration additive d'abord (nouvelles tables/
-- colonnes + réinjection des données existantes), puis retrait des anciennes
-- colonnes devenues redondantes une fois les données transférées.

-- ── 1. Nouvelles tables ──────────────────────────────────────────────────
CREATE TABLE `ClasseCours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idClasse` INTEGER NOT NULL,
    `idCours` INTEGER NOT NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClasseCours_idClasse_idCours_key`(`idClasse`, `idCours`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Affectation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idEnseignant` INTEGER NOT NULL,
    `idClasseCours` INTEGER NOT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Affectation_idEnseignant_idClasseCours_key`(`idEnseignant`, `idClasseCours`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `ClasseCours`
  ADD CONSTRAINT `ClasseCours_idClasse_fkey` FOREIGN KEY (`idClasse`) REFERENCES `Classe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ClasseCours_idCours_fkey` FOREIGN KEY (`idCours`) REFERENCES `Cours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ClasseCours_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Affectation`
  ADD CONSTRAINT `Affectation_idEnseignant_fkey` FOREIGN KEY (`idEnseignant`) REFERENCES `Enseignant`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Affectation_idClasseCours_fkey` FOREIGN KEY (`idClasseCours`) REFERENCES `ClasseCours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Affectation_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ── 2. Nouvelles colonnes sur Epreuve, nullable pour permettre le backfill ──
ALTER TABLE `Epreuve` ADD COLUMN `idClasse` INTEGER NULL;
ALTER TABLE `Epreuve` ADD COLUMN `idClasseCours` INTEGER NULL;

-- ── 3. Backfill : reconstruire ClasseCours à partir de l'ancien Cours.idClasse ──
INSERT INTO `ClasseCours` (`idClasse`, `idCours`, `idAdmin`, `created_at`, `updated_at`)
SELECT `idClasse`, `id`, `idAdmin`, NOW(3), NOW(3) FROM `Cours` WHERE `idClasse` IS NOT NULL;

-- ── 4. Backfill : reconstruire Affectation à partir de l'ancien Enseignant.idCours ──
INSERT INTO `Affectation` (`idEnseignant`, `idClasseCours`, `actif`, `idAdmin`, `created_at`, `updated_at`)
SELECT e.`id`, cc.`id`, e.`actif`, e.`idAdmin`, NOW(3), NOW(3)
FROM `Enseignant` e
JOIN `Cours` c ON c.`id` = e.`idCours`
JOIN `ClasseCours` cc ON cc.`idCours` = c.`id` AND cc.`idClasse` = c.`idClasse`
WHERE e.`idCours` IS NOT NULL;

-- ── 5. Backfill : Epreuve.idClasse / idClasseCours depuis l'ancien Epreuve.idCours ──
UPDATE `Epreuve` ep
JOIN `Cours` c ON c.`id` = ep.`idCours`
JOIN `ClasseCours` cc ON cc.`idCours` = c.`id` AND cc.`idClasse` = c.`idClasse`
SET ep.`idClasse` = c.`idClasse`, ep.`idClasseCours` = cc.`id`
WHERE ep.`idCours` IS NOT NULL;

-- Filet de sécurité : une épreuve sans cours (idCours déjà NULL avant migration)
-- n'a aucune classe déductible ; on la rattache à la première classe existante
-- plutôt que d'échouer la migration (cas non rencontré en pratique, table vide
-- au moment de cette migration, mais couvert pour rester une migration correcte
-- dans le cas général).
UPDATE `Epreuve` SET `idClasse` = (SELECT MIN(`id`) FROM `Classe`) WHERE `idClasse` IS NULL AND EXISTS (SELECT 1 FROM `Classe`);

-- ── 6. Retrait des anciennes colonnes devenues redondantes ──────────────
ALTER TABLE `Cours` DROP FOREIGN KEY `Cours_idClasse_fkey`;
DROP INDEX `Cours_idClasse_fkey` ON `Cours`;
ALTER TABLE `Cours` DROP COLUMN `idClasse`;

ALTER TABLE `Enseignant` DROP FOREIGN KEY `Enseignant_idCours_fkey`;
DROP INDEX `Enseignant_idCours_fkey` ON `Enseignant`;
ALTER TABLE `Enseignant` DROP COLUMN `idCours`;

ALTER TABLE `Epreuve` DROP FOREIGN KEY `Epreuve_idCours_fkey`;
DROP INDEX `Epreuve_idCours_fkey` ON `Epreuve`;
ALTER TABLE `Epreuve` DROP COLUMN `idCours`;

-- ── 7. Epreuve.idClasse devient obligatoire, une fois le backfill terminé ──
ALTER TABLE `Epreuve` MODIFY COLUMN `idClasse` INTEGER NOT NULL;
ALTER TABLE `Epreuve`
  ADD CONSTRAINT `Epreuve_idClasse_fkey` FOREIGN KEY (`idClasse`) REFERENCES `Classe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Epreuve_idClasseCours_fkey` FOREIGN KEY (`idClasseCours`) REFERENCES `ClasseCours`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ── 8. Correction du bug de suppression de classe : une salle appartient
-- toujours à une classe précise dans ce projet (salle "principale" créée
-- automatiquement) ; si la classe est supprimée, sa salle et tout ce qui en
-- dépend (inscriptions Frequente, Titulaire, déjà en CASCADE sur Salle) doit
-- l'être aussi, pour ne plus jamais laisser d'inscription "fantôme" pointant
-- vers une salle sans classe.
ALTER TABLE `Salle` DROP FOREIGN KEY `Salle_idClasse_fkey`;
ALTER TABLE `Salle` ADD CONSTRAINT `Salle_idClasse_fkey` FOREIGN KEY (`idClasse`) REFERENCES `Classe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
