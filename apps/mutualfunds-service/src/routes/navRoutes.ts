import express from 'express';
import { getSchemeNAV } from '../controllers/navController';

const router = express.Router();

router.get('/:scheme_code', getSchemeNAV);

export default router;