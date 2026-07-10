-- Un paiement n'est plus obligatoirement rattaché à une tranche du catalogue :
-- un versement peut être un montant libre, décidé au moment du paiement, sans
-- devoir correspondre à une échéance prédéfinie. La colonne devient nullable.
--
-- La contrainte de clé étrangère passe de ON DELETE CASCADE à ON DELETE SET NULL :
-- supprimer une tranche du catalogue ne doit jamais effacer l'historique des
-- versements qui la référençaient (aucune perte de données de paiement).

-- DropForeignKey
ALTER TABLE `Paiement` DROP FOREIGN KEY `Paiement_idTranche_fkey`;

-- DropIndex
DROP INDEX `Paiement_idTranche_fkey` ON `Paiement`;

-- AlterTable
ALTER TABLE `Paiement` MODIFY `idTranche` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_idTranche_fkey` FOREIGN KEY (`idTranche`) REFERENCES `Tranche`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
