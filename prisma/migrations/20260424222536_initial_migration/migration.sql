-- CreateTable
CREATE TABLE "Personne" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" DATETIME,
    "lieuNaissance" TEXT,
    "mobile" TEXT,
    "phone" TEXT,
    "typePersonne" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "alanyaID" TEXT,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Personne_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobile" TEXT,
    "alanyaID" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Quartier" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Resident" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idPers" INTEGER NOT NULL,
    "idQuartier" INTEGER,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Resident_idPers_fkey" FOREIGN KEY ("idPers") REFERENCES "Personne" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Resident_idQuartier_fkey" FOREIGN KEY ("idQuartier") REFERENCES "Quartier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VilleNaissance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Eleve" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" DATETIME NOT NULL,
    "lieuNaissance" TEXT NOT NULL,
    "sexe" INTEGER NOT NULL,
    "langue" TEXT NOT NULL,
    "photoURL" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "idVilleNaissance" INTEGER,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Eleve_idVilleNaissance_fkey" FOREIGN KEY ("idVilleNaissance") REFERENCES "VilleNaissance" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Eleve_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idEleve" INTEGER NOT NULL,
    "idPers" INTEGER NOT NULL,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Parent_idEleve_fkey" FOREIGN KEY ("idEleve") REFERENCES "Eleve" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Parent_idPers_fkey" FOREIGN KEY ("idPers") REFERENCES "Personne" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Parent_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Classe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "idCycle" INTEGER NOT NULL,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Classe_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Classe_idCycle_fkey" FOREIGN KEY ("idCycle") REFERENCES "Cycle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Frequente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idSalle" INTEGER NOT NULL,
    "idEleve" INTEGER NOT NULL,
    "commentaire" TEXT,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Frequente_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Frequente_idEleve_fkey" FOREIGN KEY ("idEleve") REFERENCES "Eleve" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Frequente_idSalle_fkey" FOREIGN KEY ("idSalle") REFERENCES "Salle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Salle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "position" TEXT,
    "surface" TEXT,
    "idClasse" INTEGER,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Salle_idClasse_fkey" FOREIGN KEY ("idClasse") REFERENCES "Classe" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Salle_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Titulaire" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idSalle" INTEGER NOT NULL,
    "idPers" INTEGER NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Titulaire_idSalle_fkey" FOREIGN KEY ("idSalle") REFERENCES "Salle" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Titulaire_idPers_fkey" FOREIGN KEY ("idPers") REFERENCES "Personne" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Titulaire_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cycle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "description" TEXT,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Cycle_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AnneeAcademique" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "periode" TEXT NOT NULL,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "AnneeAcademique_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Trimestre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "periode" TEXT NOT NULL,
    "idAca" INTEGER NOT NULL,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Trimestre_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Trimestre_idAca_fkey" FOREIGN KEY ("idAca") REFERENCES "AnneeAcademique" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "description" TEXT,
    "idAdmin" INTEGER,
    "idTrimestre" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Session_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Session_idTrimestre_fkey" FOREIGN KEY ("idTrimestre") REFERENCES "Trimestre" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Enseignant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idPers" INTEGER NOT NULL,
    "idCours" INTEGER NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Enseignant_idPers_fkey" FOREIGN KEY ("idPers") REFERENCES "Personne" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enseignant_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Enseignant_idCours_fkey" FOREIGN KEY ("idCours") REFERENCES "Cours" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cours" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libelle" TEXT NOT NULL,
    "note" REAL,
    "coefficient" REAL NOT NULL,
    "idClasse" INTEGER NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Cours_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Cours_idClasse_fkey" FOREIGN KEY ("idClasse") REFERENCES "Classe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Personne_username_key" ON "Personne"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_idPers_key" ON "Resident"("idPers");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_idPers_key" ON "Parent"("idPers");

-- CreateIndex
CREATE UNIQUE INDEX "Frequente_idEleve_idSalle_key" ON "Frequente"("idEleve", "idSalle");

-- CreateIndex
CREATE UNIQUE INDEX "Titulaire_idSalle_key" ON "Titulaire"("idSalle");

-- CreateIndex
CREATE UNIQUE INDEX "Titulaire_idPers_key" ON "Titulaire"("idPers");

-- CreateIndex
CREATE UNIQUE INDEX "Enseignant_idPers_key" ON "Enseignant"("idPers");
