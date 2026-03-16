import express from 'express';
import {
    getInsurancesByType,
    getMaatschappijen,
    calculatePremium
} from '../controllers/insuranceController.js';

const router = express.Router();

// Haal maatschappijen op: GET /api/maatschappijen
router.get('/maatschappijen', getMaatschappijen);

// Haal vergelijking op: GET /api/vergelijking/motor
router.get('/vergelijking/:type', getInsurancesByType);

// Bereken premie: POST /api/bereken-premie
router.post('/bereken-premie', calculatePremium);

export default router;