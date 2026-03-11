// import express from 'express';
// import { getInsuranceByType, calculatePremium } from '../controllers/insurancecontroller.js';
// import db from '../config/db.js';

// const router = express.Router();

// router.get('/vergelijking/:type', getInsuranceByType);
// router.post('/bereken-premie', calculatePremium);

// // Contact route
// router.post('/submit-contact', (req, res) => {
//     const { name, email, phone, subject, message } = req.body;

//     if (!name || !email || !message) {
//         return res.status(400).json({ error: "Naam, email en bericht zijn verplicht." });
//     }

//     const sql = `INSERT INTO contact_berichten (naam, email, telefoon, onderwerp, bericht) 
//                  VALUES (?, ?, ?, ?, ?)`;
//     const params = [name, email, phone, subject, message];

//     db.run(sql, params, function(err) {
//         if (err) {
//             console.error("❌ DB Error:", err.message);
//             return res.status(500).json({ error: "Databasefout" });
//         }
//         console.log(`✅ Nieuw bericht van ${name} opgeslagen (ID: ${this.lastID})`);
//         res.status(200).json({ success: true, message: "Bericht opgeslagen" });
//     });
// });

// export default router;


import express from 'express';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const router = express.Router();

// Route om verzekeringen op te halen
router.get('/vergelijking/:type', async (req, res) => {
    const { type } = req.params;

    try {
        const resultaten = await prisma.verzekering.findMany({
            where: { categorie: type }
        });
        res.json(resultaten);
    } catch (error) {
        console.error("Prisma error:", error);
        res.status(500).json({ error: "Database fout" });
    }
});

// Route voor de premie berekening
router.post('/bereken-premie', (req, res) => {
    const { dagwaarde } = req.body;
    if (!dagwaarde || dagwaarde <= 0) return res.status(400).json({ error: "Ongeldige waarde" });

    let premie = dagwaarde * 0.025;
    if (premie < 1500) premie = 1500;

    res.json({ premie: premie.toFixed(2), uitleg: "Berekend op 2.5% WA tarief" });
});

export default router;