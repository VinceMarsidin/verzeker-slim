import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./verzekerslim.db');

db.serialize(() => {
    // 1. Tabel voor de verzekeringen (de vergelijkingstabel)
    db.run(`CREATE TABLE IF NOT EXISTS verzekeringen (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categorie TEXT,
        dekking_naam TEXT,
        assuria TEXT,
        fatum TEXT,
        self_reliance TEXT,
        parsasco TEXT
    )`);

    // 2. Tabel voor de contactberichten (DIT IS DE NIEUWE)
    db.run(`CREATE TABLE IF NOT EXISTS contact_berichten (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        naam TEXT,
        email TEXT,
        telefoon TEXT,
        onderwerp TEXT,
        bericht TEXT,
        datum DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 3. Database vullen met data (alleen als de tabel leeg is)
    db.get("SELECT COUNT(*) as count FROM verzekeringen", (err, row) => {
        if (row && row.count === 0) {
            console.log("Database 'verzekeringen' is leeg. Bezig met vullen...");
            const stmt = db.prepare("INSERT INTO verzekeringen (categorie, dekking_naam, assuria, fatum, self_reliance, parsasco) VALUES (?,?,?,?,?,?)");
            
            // MOTOR
            stmt.run('motor', 'WA Dekking', '✔', '✔', '✔', '✔');
            stmt.run('motor', 'Casco / All-Risk', '✔', '✔', '✔', '✔');
            stmt.run('motor', '24/7 Sleepdienst', '✔', '✔', '✔', '❌');

            // REIS
            stmt.run('reis', 'Medische Kosten', '✔', '✔', '✔', '✔');
            stmt.run('reis', 'Bagage Dekking', 'SRD 2500', 'SRD 2000', 'SRD 3000', 'SRD 1500');

            // WOON
            stmt.run('woon', 'Brandverzekering', '✔', '✔', '✔', '✔');
            stmt.run('woon', 'Inbraak/Diefstal', '✔', 'Optioneel', '✔', '✔');

            // LEVEN
            stmt.run('leven', 'Uitvaartdekking', '✔', '✔', '✔', '✔');

            stmt.finalize();
            console.log("✅ Vergelijkingstabel succesvol gevuld!");
        }
    });
});

export default db;