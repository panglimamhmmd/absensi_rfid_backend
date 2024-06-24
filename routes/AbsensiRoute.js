import express from 'express';
import {
    getAbsensi,
    getAbsensiById,
    createAbsensi,
    deleteAbsensi,
    updateAbsensi,
    getDashboardInfo,
    getTodayAbsensi,
    recapMonthly,
} from '../controllers/Absen.js';
import { adminOnly, verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/absensi', verifyUser, getAbsensi);
// todak absensi utk dashboard
router.get('/absensi/today', verifyUser, getTodayAbsensi);
router.get('/absensi/:id', verifyUser, getAbsensiById);
router.post('/absensi', verifyUser, createAbsensi);
router.patch('/absensi/:id', verifyUser, updateAbsensi);
router.delete('/absensi/:id', verifyUser, deleteAbsensi);

//get Dashboard

router.get('/dashboard', adminOnly, verifyUser, getDashboardInfo);
router.get('/recap', adminOnly, verifyUser, recapMonthly);

export default router;
