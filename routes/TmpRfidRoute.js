import express from 'express';
import {
    getNoKartu,
    createNoKartu,
    prosesAbsensi,
    deleteNoKartu,
} from '../controllers/TmpRfid.js';

const router = express.Router();

router.get('/tmprfid', getNoKartu);
router.get('/tmprfid/:nokartu/:mode', createNoKartu);
router.get('/tmprfid/prosesdata', prosesAbsensi);
router.delete('/tmprfid', deleteNoKartu);

export default router;
