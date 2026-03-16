/*
  Warnings:

  - You are about to drop the column `assuria` on the `Verzekering` table. All the data in the column will be lost.
  - You are about to drop the column `dekking_naam` on the `Verzekering` table. All the data in the column will be lost.
  - You are about to drop the column `fatum` on the `Verzekering` table. All the data in the column will be lost.
  - You are about to drop the column `parsasco` on the `Verzekering` table. All the data in the column will be lost.
  - You are about to drop the column `self_reliance` on the `Verzekering` table. All the data in the column will be lost.
  - Added the required column `maatschappijId` to the `Verzekering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `premie_bedrag` to the `Verzekering` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Verzekering` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Maatschappij" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "naam" TEXT NOT NULL,
    "logoUrl" TEXT,
    "contactEmail" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Verzekering" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categorie" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "premie_bedrag" REAL NOT NULL,
    "maatschappijId" INTEGER NOT NULL,
    CONSTRAINT "Verzekering_maatschappijId_fkey" FOREIGN KEY ("maatschappijId") REFERENCES "Maatschappij" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Verzekering" ("categorie", "id") SELECT "categorie", "id" FROM "Verzekering";
DROP TABLE "Verzekering";
ALTER TABLE "new_Verzekering" RENAME TO "Verzekering";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Maatschappij_naam_key" ON "Maatschappij"("naam");
