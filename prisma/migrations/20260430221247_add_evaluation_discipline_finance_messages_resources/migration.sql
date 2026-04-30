-- CreateTable
CREATE TABLE "NatureEpreuve" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "description" TEXT,
    "coefficient" REAL NOT NULL DEFAULT 1.0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "NatureEpreuve_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Epreuve" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "description" TEXT,
    "idNatureEpreuve" INTEGER NOT NULL,
    "idCours" INTEGER,
    "dateEpreuve" DATETIME NOT NULL,
    "duree" INTEGER,
    "coefficient" REAL NOT NULL DEFAULT 1.0,
    "noteMax" REAL NOT NULL DEFAULT 20.0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Epreuve_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Epreuve_idNatureEpreuve_fkey" FOREIGN KEY ("idNatureEpreuve") REFERENCES "NatureEpreuve" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Epreuve_idCours_fkey" FOREIGN KEY ("idCours") REFERENCES "Cours" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idEpreuve" INTEGER NOT NULL,
    "idEleve" INTEGER NOT NULL,
    "note" REAL,
    "appreciation" TEXT,
    "rang" INTEGER,
    "commentaire" TEXT,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Evaluation_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Evaluation_idEpreuve_fkey" FOREIGN KEY ("idEpreuve") REFERENCES "Epreuve" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Evaluation_idEleve_fkey" FOREIGN KEY ("idEleve") REFERENCES "Eleve" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Discipline" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "description" TEXT,
    "estFaute" BOOLEAN NOT NULL DEFAULT true,
    "gravite" INTEGER NOT NULL DEFAULT 1,
    "sanctionType" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Discipline_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rapport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idEleve" INTEGER NOT NULL,
    "idDiscipline" INTEGER NOT NULL,
    "idAuteur" INTEGER NOT NULL,
    "dateRapport" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "temoins" TEXT,
    "sanctionAppliquee" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'OUVERT',
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Rapport_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Rapport_idEleve_fkey" FOREIGN KEY ("idEleve") REFERENCES "Eleve" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rapport_idDiscipline_fkey" FOREIGN KEY ("idDiscipline") REFERENCES "Discipline" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rapport_idAuteur_fkey" FOREIGN KEY ("idAuteur") REFERENCES "Personne" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ModePaiement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "description" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "ModePaiement_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tranche" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "description" TEXT,
    "montant" REAL NOT NULL,
    "echeance" DATETIME NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 1,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Tranche_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idScolarite" INTEGER NOT NULL,
    "idTranche" INTEGER NOT NULL,
    "idModePaiement" INTEGER NOT NULL,
    "montant" REAL NOT NULL,
    "datePaiement" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "commentaire" TEXT,
    "recuNumero" TEXT,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Paiement_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Paiement_idScolarite_fkey" FOREIGN KEY ("idScolarite") REFERENCES "Scolarite" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Paiement_idTranche_fkey" FOREIGN KEY ("idTranche") REFERENCES "Tranche" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Paiement_idModePaiement_fkey" FOREIGN KEY ("idModePaiement") REFERENCES "ModePaiement" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Scolarite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idEleve" INTEGER NOT NULL,
    "idAnneeAcademique" INTEGER NOT NULL,
    "idClasse" INTEGER NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'ACTIF',
    "dateInscription" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fraisInscription" REAL NOT NULL DEFAULT 0,
    "fraisScolarite" REAL NOT NULL DEFAULT 0,
    "reduction" REAL NOT NULL DEFAULT 0,
    "observations" TEXT,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Scolarite_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Scolarite_idEleve_fkey" FOREIGN KEY ("idEleve") REFERENCES "Eleve" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Scolarite_idAnneeAcademique_fkey" FOREIGN KEY ("idAnneeAcademique") REFERENCES "AnneeAcademique" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Scolarite_idClasse_fkey" FOREIGN KEY ("idClasse") REFERENCES "Classe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "objet" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "typeMessage" TEXT NOT NULL DEFAULT 'GENERAL',
    "idExpediteur" INTEGER,
    "destinaireType" TEXT NOT NULL,
    "idDestinataire" INTEGER,
    "dateEnvoi" DATETIME,
    "statut" TEXT NOT NULL DEFAULT 'BROUILLON',
    "pieceJointeURL" TEXT,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Message_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Message_idExpediteur_fkey" FOREIGN KEY ("idExpediteur") REFERENCES "Personne" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Livre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titre" TEXT NOT NULL,
    "auteur" TEXT,
    "isbn" TEXT,
    "edition" TEXT,
    "anneePublication" INTEGER,
    "nombreExemplaires" INTEGER NOT NULL DEFAULT 1,
    "disponible" INTEGER NOT NULL DEFAULT 1,
    "idClasse" INTEGER,
    "idCours" INTEGER,
    "description" TEXT,
    "couvertureURL" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Livre_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Livre_idClasse_fkey" FOREIGN KEY ("idClasse") REFERENCES "Classe" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Livre_idCours_fkey" FOREIGN KEY ("idCours") REFERENCES "Cours" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Specialite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "description" TEXT,
    "idCycle" INTEGER,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Specialite_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Specialite_idCycle_fkey" FOREIGN KEY ("idCycle") REFERENCES "Cycle" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_idEpreuve_idEleve_key" ON "Evaluation"("idEpreuve", "idEleve");

-- CreateIndex
CREATE UNIQUE INDEX "Scolarite_idEleve_idAnneeAcademique_key" ON "Scolarite"("idEleve", "idAnneeAcademique");
