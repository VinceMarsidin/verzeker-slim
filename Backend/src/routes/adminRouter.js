import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login
router.get('/data', authenticateToken, adminController.getAdminData);

// Dashboard
// 1. Premies / Verzekeringen (CRUD)
router.get('/insurances', authenticateToken, adminController.getInsurances);
router.post('/insurances', authenticateToken, adminController.createInsurance);
router.get('/insurances/:id', authenticateToken, adminController.getInsuranceById);
router.put('/insurances/:id', authenticateToken, adminController.updateInsurance);
router.delete('/insurances/:id', authenticateToken, adminController.deleteInsurance);

// 2. Maatschappijen (CRUD)
router.get('/maatschappijen', authenticateToken, adminController.getMaatschappijen);
router.get('/maatschappijen/:id', authenticateToken, adminController.getMaatschappijById);
router.post('/maatschappijen', authenticateToken, adminController.createMaatschappij);
router.put('/maatschappijen/:id', authenticateToken, adminController.updateMaatschappij);
router.delete('/maatschappijen/:id', authenticateToken, adminController.deleteMaatschappij);

// 3. Admin User beheer
router.get('/admins', authenticateToken, adminController.getAdmins);
router.post('/admins', authenticateToken, adminController.createAdmin);
router.delete('/admins/:id', authenticateToken, adminController.deleteAdmin);

// 4. Contact Berichten
router.get('/messages', authenticateToken, adminController.getMessages);
router.get('/messages/:id', authenticateToken, adminController.getMessageById);
router.delete('/messages/:id', authenticateToken, adminController.deleteMessage);

export default router;