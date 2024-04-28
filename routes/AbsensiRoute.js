import express from 'express';
import {
    getAbsensi,
    getAbsensiById,
    createAbsensi,
    deleteAbsensi,
    updateAbsensi,
} from '../controllers/Absen.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/absensi', verifyUser, getAbsensi);
router.get('/absensi/:id', verifyUser, getAbsensiById);
router.post('/absensi', verifyUser, createAbsensi);
router.patch('/absensi/:id', verifyUser, updateAbsensi);
router.delete('/absensi/:id', verifyUser, deleteAbsensi);

export default router;
