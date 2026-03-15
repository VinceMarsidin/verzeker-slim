import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Haal alle data op speciaal voor de admin (om te bewerken)
export const getAdminData = async (req, res) => {
    try {
        const data = await prisma.verzekering.findMany();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Fout bij ophalen admin data" });
    }
};

// Update een specifieke waarde
export const updateInsurance = async (req, res) => {
    const { id, field, value } = req.body;

    try {
        const updated = await prisma.verzekering.update({
            where: { id: parseInt(id) },
            data: { [field]: value }
        });
        res.json({ success: true, updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Update mislukt" });
    }
};