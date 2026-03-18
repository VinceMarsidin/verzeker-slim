import pkg from '@prisma/client';
import bcrypt from 'bcrypt';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();


// Haal data op voor het dashboard
export const getAdminData = async (req, res) => {
    try {
        const data = await prisma.verzekering.findMany({ include: { maatschappij: true } });
        res.json(data);
    } catch (error) { res.status(500).json({ error: "Fout bij ophalen" }); }
};

// Haal maatschappijen op
export const getMaatschappijen = async (req, res) => {
    try {
        const data = await prisma.maatschappij.findMany({ orderBy: { naam: 'asc' } });
        res.json(data);
    } catch (error) { res.status(500).json({ error: "Fout bij ophalen" }); }
};

// Maak maatschappij aan
export const createMaatschappij = async (req, res) => {
    try {
        const { naam, logoUrl, contactEmail } = req.body;
        const nieuw = await prisma.maatschappij.create({ data: { naam, logoUrl, contactEmail } });
        res.json(nieuw);
    } catch (error) { res.status(500).json({ error: "Fout bij opslaan" }); }
};

// Haal verzekeringen op
export const getInsurances = async (req, res) => {
    try {
        const data = await prisma.verzekering.findMany({ include: { maatschappij: true } });
        res.json(data);
    } catch (error) { res.status(500).json({ error: "Fout bij ophalen" }); }
};

// Maak verzekering aan
export const createInsurance = async (req, res) => {
    try {
        const { type, categorie, premie_bedrag, maatschappijId } = req.body;

        const newInsurance = await prisma.verzekering.create({
            data: {
                type: type,
                categorie: categorie,
                premie_bedrag: String(premie_bedrag),
                maatschappijId: parseInt(maatschappijId)
            }
        });
        res.json(newInsurance);
    } catch (error) {
        console.error("PRISMA FOUT:", error);
        res.status(500).json({ error: error.message });
    }
};

// DEZE FUNCTIE MOET BESTAAN VOOR DE .PUT ROUTE
export const updateInsurance = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, categorie, premie_bedrag, maatschappijId } = req.body;

        const updated = await prisma.verzekering.update({
            where: { id: parseInt(id) },
            data: {
                type: type,
                categorie: categorie,
                premie_bedrag: String(premie_bedrag),
                maatschappijId: parseInt(maatschappijId)
            }
        });
        res.json(updated);
    } catch (error) {
        console.error("Update fout:", error);
        res.status(500).json({ error: "Update mislukt" });
    }
};



// Verwijder een maatschappij
export const deleteMaatschappij = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.maatschappij.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Maatschappij verwijderd" });
    } catch (error) {
        res.status(500).json({ error: "Verwijderen mislukt. Let op: je kunt geen maatschappij verwijderen die nog gekoppelde premies heeft." });
    }
};

// Verwijder een verzekering/premie
export const deleteInsurance = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.verzekering.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: "Premie verwijderd" });
    } catch (error) {
        res.status(500).json({ error: "Verwijderen mislukt" });
    }
};

// Let op: Als je een Maatschappij probeert te verwijderen die nog gekoppelde Premies heeft, zal SQLite een fout geven (Foreign Key Constraint). Je moet dan eerst de premies van dat bedrijf verwijderen.


// Haal één specifieke verzekering op voor bewerken
export const getMaatschappijById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await prisma.maatschappij.findUnique({
            where: { id: parseInt(id) }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Ophalen maatschappij mislukt" });
    }
};

export const getInsuranceById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await prisma.verzekering.findUnique({
            where: { id: parseInt(id) },
            include: { maatschappij: true }
        });
        if (!data) return res.status(404).json({ error: "Verzekering niet gevonden" });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Ophalen verzekering mislukt" });
    }
};


export const updateMaatschappij = async (req, res) => {
    try {
        const { id } = req.params;
        const { naam, logoUrl, contactEmail } = req.body;
        const updated = await prisma.maatschappij.update({
            where: { id: parseInt(id) },
            data: { naam, logoUrl, contactEmail }
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Update maatschappij mislukt" });
    }
};


// -------------------------------------------------------------------------------

export const getAdmins = async (req, res) => {
    try {
        const admins = await prisma.admin.findMany({
            select: { id: true, username: true } // Wachtwoord weglaten voor veiligheid
        });
        res.json(admins);
    } catch (error) {
        res.status(500).json({ error: "Fout bij ophalen admins" });
    }
};

export const createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.admin.create({
            data: {
                username,
                password: hashedPassword
            }
        });
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ error: "Kon admin niet aanmaken. Bestaat de naam al?" });
    }
};

// 3. Verwijder een admin
export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        // Optioneel: check of de admin niet zichzelf verwijdert
        if (req.user.id === parseInt(id)) {
            return res.status(400).json({ error: "Je kunt je eigen account niet verwijderen" });
        }
        await prisma.admin.delete({ where: { id: parseInt(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Verwijderen mislukt" });
    }
};

// Haal alle berichten op
export const getMessages = async (req, res) => {
    try {
        const data = await prisma.contactBericht.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(data);
    } catch (error) { res.status(500).json({ error: "Fout bij ophalen" }); }
};

// Haal één bericht op
export const getMessageById = async (req, res) => {
    try {
        const data = await prisma.contactBericht.findUnique({ where: { id: parseInt(req.params.id) } });
        res.json(data);
    } catch (error) { res.status(500).json({ error: "Fout bij ophalen" }); }
};

// Verwijder bericht
export const deleteMessage = async (req, res) => {
    try {
        await prisma.contactBericht.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: "Fout bij verwijderen" }); }
};

