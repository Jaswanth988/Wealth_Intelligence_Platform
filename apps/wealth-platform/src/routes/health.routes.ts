import { Router }
from "express";

import {
  checkServices
}
from "../modules/Health/health.controller"

const router = Router();

router.get(
  "/services",
  checkServices
);

export default router;