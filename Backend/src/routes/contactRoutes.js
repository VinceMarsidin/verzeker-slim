import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Route: POST /api/contact/submit
router.post('/submit', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Verbeterde validatie: Check of alle verplichte velden aanwezig zijn
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "Oeps! Je bent een verplicht veld vergeten in te vullen." });
    }

    try {
        const nieuwBericht = await prisma.contactBericht.create({
            data: { name, email, phone, subject, message }
        });

        res.status(200).json({
            success: true,
            message: "Bericht succesvol verstuurd!",
            id: nieuwBericht.id
        });
    } catch (error) {
        console.error("Prisma Error:", error);
        res.status(500).json({ error: "Er ging iets mis bij de database. Probeer het later opnieuw." });
    }
});

export default router;