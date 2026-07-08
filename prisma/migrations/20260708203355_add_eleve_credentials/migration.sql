-- AlterTable
ALTER TABLE "Eleve" ADD COLUMN "username" TEXT;
ALTER TABLE "Eleve" ADD COLUMN "password" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Eleve_username_key" ON "Eleve"("username");
