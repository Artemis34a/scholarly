-- CreateTable
CREATE TABLE "EmploiDuTemps" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jour" TEXT NOT NULL,
    "heureDebut" TEXT NOT NULL,
    "heureFin" TEXT NOT NULL,
    "idClasse" INTEGER NOT NULL,
    "idCours" INTEGER NOT NULL,
    "idSalle" INTEGER,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "idAdmin" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "EmploiDuTemps_idClasse_fkey" FOREIGN KEY ("idClasse") REFERENCES "Classe" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmploiDuTemps_idCours_fkey" FOREIGN KEY ("idCours") REFERENCES "Cours" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmploiDuTemps_idSalle_fkey" FOREIGN KEY ("idSalle") REFERENCES "Salle" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "EmploiDuTemps_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "Admin" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EmploiDuTemps_idClasse_jour_heureDebut_key" ON "EmploiDuTemps"("idClasse", "jour", "heureDebut");
