import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Al deze routes gebruiken 'authenticateToken'
// Als je geen geldig token meestuurt, kom je hier niet binnen!
router.get('/data', authenticateToken, adminController.getAdminData);
router.put('/update', authenticateToken, adminController.updateInsurance);

export default router;