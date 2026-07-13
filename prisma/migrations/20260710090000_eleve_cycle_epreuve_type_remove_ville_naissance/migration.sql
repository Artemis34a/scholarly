-- DropForeignKey
ALTER TABLE `Eleve` DROP FOREIGN KEY `Eleve_idVilleNaissance_fkey`;

-- DropForeignKey
ALTER TABLE `Epreuve` DROP FOREIGN KEY `Epreuve_idNatureEpreuve_fkey`;

-- DropForeignKey
ALTER TABLE `NatureEpreuve` DROP FOREIGN KEY `NatureEpreuve_idAdmin_fkey`;

-- DropIndex
DROP INDEX `Eleve_idVilleNaissance_fkey` ON `Eleve`;

-- DropIndex
DROP INDEX `Epreuve_idNatureEpreuve_fkey` ON `Epreuve`;

-- AlterTable: add `cycle` as nullable first so existing rows can be backfilled,
-- then tighten to NOT NULL (MySQL cannot add a required column with no default
-- when the table already has rows).
ALTER TABLE `Eleve` ADD COLUMN `cycle` ENUM('MATERNEL', 'PRIMAIRE') NULL;

UPDATE `Eleve` SET `cycle` = 'PRIMAIRE' WHERE `cycle` IS NULL;

ALTER TABLE `Eleve` MODIFY COLUMN `cycle` ENUM('MATERNEL', 'PRIMAIRE') NOT NULL;

ALTER TABLE `Eleve` DROP COLUMN `idVilleNaissance`;

-- AlterTable
ALTER TABLE `Epreuve` DROP COLUMN `idNatureEpreuve`,
    ADD COLUMN `typeEpreuve` ENUM('CONTROLE', 'EXAMEN') NOT NULL;

-- DropTable
DROP TABLE `NatureEpreuve`;

-- DropTable
DROP TABLE `VilleNaissance`;
