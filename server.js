import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import insuranceRoutes from './Backend/src/routes/insuranceRoutes.js';
import contactRouter from './Backend/src/routes/contactRouter.js';
import authRouter from './Backend/src/routes/authRouter.js';
import adminRouter from './Backend/src/routes/adminRouter.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());

// Routers
app.use('/api', insuranceRoutes);
app.use('/api/contact', contactRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/vergelijking', insuranceRoutes);


// Statisch (Frontend)
app.use(express.static(path.join(__dirname, 'Frontend')));

// Route voor de hoofdpagina
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});


// Start de server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});


