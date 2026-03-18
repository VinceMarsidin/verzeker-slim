-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Verzekering" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categorie" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "premie_bedrag" TEXT NOT NULL,
    "maatschappijId" INTEGER NOT NULL,
    CONSTRAINT "Verzekering_maatschappijId_fkey" FOREIGN KEY ("maatschappijId") REFERENCES "Maatschappij" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Verzekering" ("categorie", "id", "maatschappijId", "premie_bedrag", "type") SELECT "categorie", "id", "maatschappijId", "premie_bedrag", "type" FROM "Verzekering";
DROP TABLE "Verzekering";
ALTER TABLE "new_Verzekering" RENAME TO "Verzekering";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
