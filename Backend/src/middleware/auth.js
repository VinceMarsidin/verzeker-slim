import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Toegang geweigerd. Geen token gevonden." });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_niet_veilig', (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token is niet meer geldig of onjuist." });
        }

        req.user = user;
        next();
    });
};