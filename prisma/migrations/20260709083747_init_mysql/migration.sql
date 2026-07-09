-- CreateTable
CREATE TABLE `Personne` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `dateNaissance` DATETIME(3) NULL,
    `lieuNaissance` VARCHAR(191) NULL,
    `mobile` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `typePersonne` ENUM('DIRECTEUR', 'ENSEIGNANT', 'PARENT') NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `alanyaID` VARCHAR(191) NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Personne_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NULL,
    `alanyaID` VARCHAR(191) NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quartier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resident` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idPers` INTEGER NOT NULL,
    `idQuartier` INTEGER NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Resident_idPers_key`(`idPers`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VilleNaissance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Eleve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `dateNaissance` DATETIME(3) NOT NULL,
    `lieuNaissance` VARCHAR(191) NOT NULL,
    `sexe` INTEGER NOT NULL,
    `langue` VARCHAR(191) NOT NULL,
    `photoURL` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `idVilleNaissance` INTEGER NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Eleve_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idEleve` INTEGER NOT NULL,
    `idPers` INTEGER NOT NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Parent_idPers_key`(`idPers`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Classe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `idCycle` INTEGER NOT NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Frequente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idSalle` INTEGER NOT NULL,
    `idEleve` INTEGER NOT NULL,
    `commentaire` VARCHAR(191) NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Frequente_idEleve_idSalle_key`(`idEleve`, `idSalle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Salle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NULL,
    `surface` VARCHAR(191) NULL,
    `idClasse` INTEGER NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Titulaire` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idSalle` INTEGER NOT NULL,
    `idPers` INTEGER NOT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Titulaire_idSalle_key`(`idSalle`),
    UNIQUE INDEX `Titulaire_idPers_key`(`idPers`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cycle` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnneeAcademique` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `periode` VARCHAR(191) NOT NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trimestre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `periode` VARCHAR(191) NOT NULL,
    `idAca` INTEGER NOT NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `idAdmin` INTEGER NULL,
    `idTrimestre` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Enseignant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idPers` INTEGER NOT NULL,
    `idCours` INTEGER NOT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Enseignant_idPers_key`(`idPers`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `note` DOUBLE NULL,
    `coefficient` DOUBLE NOT NULL,
    `idClasse` INTEGER NOT NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `description` VARCHAR(191) NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmploiDuTemps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jour` VARCHAR(191) NOT NULL,
    `heureDebut` VARCHAR(191) NOT NULL,
    `heureFin` VARCHAR(191) NOT NULL,
    `idClasse` INTEGER NOT NULL,
    `idCours` INTEGER NOT NULL,
    `idSalle` INTEGER NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `EmploiDuTemps_idClasse_jour_heureDebut_key`(`idClasse`, `jour`, `heureDebut`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NatureEpreuve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `coefficient` DOUBLE NOT NULL DEFAULT 1.0,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Epreuve` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `idNatureEpreuve` INTEGER NOT NULL,
    `idCours` INTEGER NULL,
    `dateEpreuve` DATETIME(3) NOT NULL,
    `duree` INTEGER NULL,
    `coefficient` DOUBLE NOT NULL DEFAULT 1.0,
    `noteMax` DOUBLE NOT NULL DEFAULT 20.0,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idEpreuve` INTEGER NOT NULL,
    `idEleve` INTEGER NOT NULL,
    `note` DOUBLE NULL,
    `appreciation` VARCHAR(191) NULL,
    `rang` INTEGER NULL,
    `commentaire` VARCHAR(191) NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Evaluation_idEpreuve_idEleve_key`(`idEpreuve`, `idEleve`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discipline` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `estFaute` BOOLEAN NOT NULL DEFAULT true,
    `gravite` INTEGER NOT NULL DEFAULT 1,
    `sanctionType` VARCHAR(191) NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rapport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idEleve` INTEGER NOT NULL,
    `idDiscipline` INTEGER NOT NULL,
    `idAuteur` INTEGER NOT NULL,
    `dateRapport` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `description` VARCHAR(191) NOT NULL,
    `temoins` VARCHAR(191) NULL,
    `sanctionAppliquee` VARCHAR(191) NULL,
    `statut` VARCHAR(191) NOT NULL DEFAULT 'OUVERT',
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModePaiement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tranche` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `montant` DOUBLE NOT NULL,
    `echeance` DATETIME(3) NOT NULL,
    `ordre` INTEGER NOT NULL DEFAULT 1,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Paiement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idScolarite` INTEGER NOT NULL,
    `idTranche` INTEGER NOT NULL,
    `idModePaiement` INTEGER NOT NULL,
    `montant` DOUBLE NOT NULL,
    `datePaiement` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reference` VARCHAR(191) NULL,
    `commentaire` VARCHAR(191) NULL,
    `recuNumero` VARCHAR(191) NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Scolarite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idEleve` INTEGER NOT NULL,
    `idAnneeAcademique` INTEGER NOT NULL,
    `idClasse` INTEGER NOT NULL,
    `statut` VARCHAR(191) NOT NULL DEFAULT 'ACTIF',
    `dateInscription` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fraisInscription` DOUBLE NOT NULL DEFAULT 0,
    `fraisScolarite` DOUBLE NOT NULL DEFAULT 0,
    `reduction` DOUBLE NOT NULL DEFAULT 0,
    `observations` VARCHAR(191) NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Scolarite_idEleve_idAnneeAcademique_key`(`idEleve`, `idAnneeAcademique`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `objet` VARCHAR(191) NOT NULL,
    `contenu` VARCHAR(191) NOT NULL,
    `typeMessage` VARCHAR(191) NOT NULL DEFAULT 'GENERAL',
    `idExpediteur` INTEGER NULL,
    `destinaireType` VARCHAR(191) NOT NULL,
    `idDestinataire` INTEGER NULL,
    `dateEnvoi` DATETIME(3) NULL,
    `statut` VARCHAR(191) NOT NULL DEFAULT 'BROUILLON',
    `pieceJointeURL` VARCHAR(191) NULL,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Livre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titre` VARCHAR(191) NOT NULL,
    `auteur` VARCHAR(191) NULL,
    `isbn` VARCHAR(191) NULL,
    `edition` VARCHAR(191) NULL,
    `anneePublication` INTEGER NULL,
    `nombreExemplaires` INTEGER NOT NULL DEFAULT 1,
    `disponible` INTEGER NOT NULL DEFAULT 1,
    `idClasse` INTEGER NULL,
    `idCours` INTEGER NULL,
    `description` VARCHAR(191) NULL,
    `couvertureURL` VARCHAR(191) NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Specialite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `libelle` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `idCycle` INTEGER NULL,
    `actif` BOOLEAN NOT NULL DEFAULT true,
    `idAdmin` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Personne` ADD CONSTRAINT `Personne_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resident` ADD CONSTRAINT `Resident_idPers_fkey` FOREIGN KEY (`idPers`) REFERENCES `Personne`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resident` ADD CONSTRAINT `Resident_idQuartier_fkey` FOREIGN KEY (`idQuartier`) REFERENCES `Quartier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Eleve` ADD CONSTRAINT `Eleve_idVilleNaissance_fkey` FOREIGN KEY (`idVilleNaissance`) REFERENCES `VilleNaissance`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Eleve` ADD CONSTRAINT `Eleve_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parent` ADD CONSTRAINT `Parent_idEleve_fkey` FOREIGN KEY (`idEleve`) REFERENCES `Eleve`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parent` ADD CONSTRAINT `Parent_idPers_fkey` FOREIGN KEY (`idPers`) REFERENCES `Personne`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Parent` ADD CONSTRAINT `Parent_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Classe` ADD CONSTRAINT `Classe_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Classe` ADD CONSTRAINT `Classe_idCycle_fkey` FOREIGN KEY (`idCycle`) REFERENCES `Cycle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Frequente` ADD CONSTRAINT `Frequente_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Frequente` ADD CONSTRAINT `Frequente_idEleve_fkey` FOREIGN KEY (`idEleve`) REFERENCES `Eleve`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Frequente` ADD CONSTRAINT `Frequente_idSalle_fkey` FOREIGN KEY (`idSalle`) REFERENCES `Salle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salle` ADD CONSTRAINT `Salle_idClasse_fkey` FOREIGN KEY (`idClasse`) REFERENCES `Classe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salle` ADD CONSTRAINT `Salle_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Titulaire` ADD CONSTRAINT `Titulaire_idSalle_fkey` FOREIGN KEY (`idSalle`) REFERENCES `Salle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Titulaire` ADD CONSTRAINT `Titulaire_idPers_fkey` FOREIGN KEY (`idPers`) REFERENCES `Personne`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Titulaire` ADD CONSTRAINT `Titulaire_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cycle` ADD CONSTRAINT `Cycle_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnneeAcademique` ADD CONSTRAINT `AnneeAcademique_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trimestre` ADD CONSTRAINT `Trimestre_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trimestre` ADD CONSTRAINT `Trimestre_idAca_fkey` FOREIGN KEY (`idAca`) REFERENCES `AnneeAcademique`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_idTrimestre_fkey` FOREIGN KEY (`idTrimestre`) REFERENCES `Trimestre`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enseignant` ADD CONSTRAINT `Enseignant_idPers_fkey` FOREIGN KEY (`idPers`) REFERENCES `Personne`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enseignant` ADD CONSTRAINT `Enseignant_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enseignant` ADD CONSTRAINT `Enseignant_idCours_fkey` FOREIGN KEY (`idCours`) REFERENCES `Cours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cours` ADD CONSTRAINT `Cours_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cours` ADD CONSTRAINT `Cours_idClasse_fkey` FOREIGN KEY (`idClasse`) REFERENCES `Classe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmploiDuTemps` ADD CONSTRAINT `EmploiDuTemps_idClasse_fkey` FOREIGN KEY (`idClasse`) REFERENCES `Classe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmploiDuTemps` ADD CONSTRAINT `EmploiDuTemps_idCours_fkey` FOREIGN KEY (`idCours`) REFERENCES `Cours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmploiDuTemps` ADD CONSTRAINT `EmploiDuTemps_idSalle_fkey` FOREIGN KEY (`idSalle`) REFERENCES `Salle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmploiDuTemps` ADD CONSTRAINT `EmploiDuTemps_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NatureEpreuve` ADD CONSTRAINT `NatureEpreuve_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Epreuve` ADD CONSTRAINT `Epreuve_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Epreuve` ADD CONSTRAINT `Epreuve_idNatureEpreuve_fkey` FOREIGN KEY (`idNatureEpreuve`) REFERENCES `NatureEpreuve`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Epreuve` ADD CONSTRAINT `Epreuve_idCours_fkey` FOREIGN KEY (`idCours`) REFERENCES `Cours`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_idEpreuve_fkey` FOREIGN KEY (`idEpreuve`) REFERENCES `Epreuve`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Evaluation` ADD CONSTRAINT `Evaluation_idEleve_fkey` FOREIGN KEY (`idEleve`) REFERENCES `Eleve`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discipline` ADD CONSTRAINT `Discipline_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rapport` ADD CONSTRAINT `Rapport_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rapport` ADD CONSTRAINT `Rapport_idEleve_fkey` FOREIGN KEY (`idEleve`) REFERENCES `Eleve`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rapport` ADD CONSTRAINT `Rapport_idDiscipline_fkey` FOREIGN KEY (`idDiscipline`) REFERENCES `Discipline`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rapport` ADD CONSTRAINT `Rapport_idAuteur_fkey` FOREIGN KEY (`idAuteur`) REFERENCES `Personne`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModePaiement` ADD CONSTRAINT `ModePaiement_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tranche` ADD CONSTRAINT `Tranche_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_idScolarite_fkey` FOREIGN KEY (`idScolarite`) REFERENCES `Scolarite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_idTranche_fkey` FOREIGN KEY (`idTranche`) REFERENCES `Tranche`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Paiement` ADD CONSTRAINT `Paiement_idModePaiement_fkey` FOREIGN KEY (`idModePaiement`) REFERENCES `ModePaiement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scolarite` ADD CONSTRAINT `Scolarite_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scolarite` ADD CONSTRAINT `Scolarite_idEleve_fkey` FOREIGN KEY (`idEleve`) REFERENCES `Eleve`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scolarite` ADD CONSTRAINT `Scolarite_idAnneeAcademique_fkey` FOREIGN KEY (`idAnneeAcademique`) REFERENCES `AnneeAcademique`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Scolarite` ADD CONSTRAINT `Scolarite_idClasse_fkey` FOREIGN KEY (`idClasse`) REFERENCES `Classe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_idExpediteur_fkey` FOREIGN KEY (`idExpediteur`) REFERENCES `Personne`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Livre` ADD CONSTRAINT `Livre_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Livre` ADD CONSTRAINT `Livre_idClasse_fkey` FOREIGN KEY (`idClasse`) REFERENCES `Classe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Livre` ADD CONSTRAINT `Livre_idCours_fkey` FOREIGN KEY (`idCours`) REFERENCES `Cours`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Specialite` ADD CONSTRAINT `Specialite_idAdmin_fkey` FOREIGN KEY (`idAdmin`) REFERENCES `Admin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Specialite` ADD CONSTRAINT `Specialite_idCycle_fkey` FOREIGN KEY (`idCycle`) REFERENCES `Cycle`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
