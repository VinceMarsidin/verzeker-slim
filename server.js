import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import insuranceRoutes from './Backend/src/routes/insuranceRoutes.js';
import db from './Backend/src/config/db.js'; // Importeer db hier ook

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

// TEST ROUTE DIRECT IN SERVER.JS
app.post('/api/submit-contact', (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    
    const sql = `INSERT INTO contact_berichten (naam, email, telefoon, onderwerp, bericht) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [name, email, phone, subject, message], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ success: true, message: "Opgeslagen!" });
    });
});

// De rest van je routes
app.use('/api', insuranceRoutes);

// Static files ALTIJD als laatste
app.use(express.static(path.join(__dirname, 'Frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});