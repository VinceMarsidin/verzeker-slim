-- CreateTable
CREATE TABLE "Verzekering" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categorie" TEXT NOT NULL,
    "dekking_naam" TEXT NOT NULL,
    "assuria" TEXT NOT NULL,
    "fatum" TEXT NOT NULL,
    "self_reliance" TEXT NOT NULL,
    "parsasco" TEXT NOT NULL
);
