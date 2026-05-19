import express from 'express';
import { getNetWorth } from '../controllers/netWorthController';

const router = express.Router();

router.get('/:investor_id', getNetWorth);

export default router;