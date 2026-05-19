import express from 'express';

import {
  getSchemes,
  getSchemeByCode,
  updateNAV,
} from '../controllers/schemeController';

const router = express.Router();

router.get('/', getSchemes);

router.get('/:schemeCode', getSchemeByCode);

router.patch(
  '/nav/:schemeCode',
  updateNAV
);

export default router;