import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Toegang geweigerd. Geen token gevonden." });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'supergeheim_verander_dit_later', (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token is niet meer geldig of onjuist." });
        }

        req.user = user;
        next();
    });
};