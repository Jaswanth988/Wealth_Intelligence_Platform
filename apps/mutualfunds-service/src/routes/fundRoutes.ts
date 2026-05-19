import express from 'express';

import {
  investInFund,
} from '../controllers/fundController';

const router = express.Router();

router.post('/invest', investInFund);

export default router;