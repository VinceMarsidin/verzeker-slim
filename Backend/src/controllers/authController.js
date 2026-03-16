import pkg from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const login = async (req, res) => {
    const { username, password } = req.body;
    console.log("Inlogpoging voor:", username);

    try {
        const admin = await prisma.admin.findUnique({ where: { username } });

        if (!admin) {
            console.log("Gebruiker niet gevonden");
            return res.status(401).json({ error: "Ongeldige gegevens" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        console.log("Wachtwoord match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: "Ongeldige gegevens" });
        }

        // Maak het token aan
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET || 'supergeheim_verander_dit_later',
            { expiresIn: '12h' }
        );

        return res.json({
            success: true,
            token: token
        });

    } catch (err) {
        console.error("Database fout:", err);
        return res.status(500).json({ error: "Server fout" });
    }
};