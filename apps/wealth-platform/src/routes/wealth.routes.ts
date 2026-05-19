import { Router } from "express";

import {
  getWealthSummary
} from "../modules/wealth/wealth.controller";

import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/:investorId/summary",
  authenticateJWT,
  getWealthSummary
);

export default router;