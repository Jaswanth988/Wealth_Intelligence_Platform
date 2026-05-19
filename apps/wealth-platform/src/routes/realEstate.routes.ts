import express from 'express';

import {
  getProperties,
  addProperty
} from '../modules/real-estate/realEstate.controller';
import { authorizeRoles } from '../middleware/rbac.middleware';

const router = express.Router();
router.get(  '/:investorId',authorizeRoles(
    "INVESTOR",
    "ADMIN"
  ),getProperties);

router.post('/',addProperty);

export default router;