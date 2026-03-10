import db from '../config/db.js';

// Controller voor het ophalen van verzekeringsdata
export const getInsuranceByType = (req, res) => {
    const { type } = req.params;
    db.all("SELECT * FROM verzekeringen WHERE categorie = ?", [type], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// Controller voor de premie berekening
export const calculatePremium = (req, res) => {
    const { dagwaarde } = req.body;
    if (!dagwaarde || dagwaarde <= 0) return res.status(400).json({ error: "Ongeldige waarde" });

    let premie = dagwaarde * 0.025;
    if (premie < 1500) premie = 1500;

    res.json({ premie: premie.toFixed(2), uitleg: "Berekend op 2.5% WA tarief" });
};