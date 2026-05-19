// src/routes/auth.routes.ts

import { Router } from "express";
import {
  login,
  refreshAccessToken,
  logout,
  me,
  register,
} from "../modules/auth/auth.controller";

import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh", refreshAccessToken);
router.post("/logout", authenticateJWT, logout);
router.get("/me", authenticateJWT, me);

export default router;