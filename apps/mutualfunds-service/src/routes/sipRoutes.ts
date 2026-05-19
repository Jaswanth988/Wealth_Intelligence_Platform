import express from 'express';

import {
  createSIP,
  pauseSIP,
} from '../controllers/sipController';

const router = express.Router();

router.post('/', createSIP);

router.patch('/:id/pause', pauseSIP);

export default router;