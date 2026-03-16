import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 1. Haal alle maatschappijen op
export const getMaatschappijen = async (req, res) => {
    try {
        const alleBedrijven = await prisma.maatschappij.findMany({
            orderBy: { naam: 'asc' }
        });
        res.json(alleBedrijven);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Kon maatschappijen niet ophalen." });
    }
};

// 2. Haal verzekeringen op per type (inclusief maatschappij data)
export const getInsurancesByType = async (req, res) => {
    const { type } = req.params;
    try {
        const data = await prisma.verzekering.findMany({
            where: { categorie: type },
            include: { maatschappij: true }
        });
        res.json(data);
    } catch (error) {
        console.error("Fout bij ophalen verzekeringen:", error);
        res.status(500).json({ error: "Fout bij ophalen verzekeringen" });
    }
};

// 3. Premie berekening logica
export const calculatePremium = (req, res) => {
    const { dagwaarde } = req.body;

    if (!dagwaarde || dagwaarde <= 0) {
        return res.status(400).json({ error: "Ongeldige waarde" });
    }

    let premie = dagwaarde * 0.025;
    if (premie < 1500) premie = 1500;

    res.json({
        premie: premie.toFixed(2),
        uitleg: "Berekend op 2.5% WA tarief"
    });
};