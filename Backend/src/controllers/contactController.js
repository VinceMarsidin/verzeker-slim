import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const nieuwBericht = await prisma.contactBericht.create({
            data: {
                name,
                email,
                phone: phone.toString(),
                subject,
                message
            }
        });

        res.status(201).json({ message: "Bedankt! We hebben je bericht ontvangen." });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Kon bericht niet opslaan." });
    }
};

export const getMessages = async (req, res) => {
    try {
        const berichten = await prisma.contactBericht.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(berichten);
    } catch (error) {
        res.status(500).json({ error: "Fout bij ophalen berichten" });
    }
};
