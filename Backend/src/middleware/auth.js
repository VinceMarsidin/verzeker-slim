// Backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    // Haal de 'Authorization' header op (bijv: "Bearer EJKLQ234...")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Toegang geweigerd. Geen token gevonden." });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_niet_veilig', (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Token is niet meer geldig of onjuist." });
        }

        // Sla de user data op in het request zodat controllers het kunnen gebruiken
        req.user = user;
        next(); // Alles ok? Ga door naar de volgende functie (de controller)
    });
};