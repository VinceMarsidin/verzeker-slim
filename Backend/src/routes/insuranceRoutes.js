import express from 'express';
import { getInsuranceByType, calculatePremium } from '../controllers/insurancecontroller.js';
import db from '../config/db.js';

const router = express.Router();

router.get('/vergelijking/:type', getInsuranceByType);
router.post('/bereken-premie', calculatePremium);

// Contact route
router.post('/submit-contact', (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Naam, email en bericht zijn verplicht." });
    }

    const sql = `INSERT INTO contact_berichten (naam, email, telefoon, onderwerp, bericht) 
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [name, email, phone, subject, message];

    db.run(sql, params, function(err) {
        if (err) {
            console.error("❌ DB Error:", err.message);
            return res.status(500).json({ error: "Databasefout" });
        }
        console.log(`✅ Nieuw bericht van ${name} opgeslagen (ID: ${this.lastID})`);
        res.status(200).json({ success: true, message: "Bericht opgeslagen" });
    });
});

export default router;