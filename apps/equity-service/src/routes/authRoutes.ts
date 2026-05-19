import express from "express";

import {
  register,
  login,
  refreshToken,
  logout
} from "../controllers/authController";

const router = express.Router();


// =========================
// AUTH ROUTES
// =========================


// REGISTER USER

router.post(
  "/register",
  register
);


// LOGIN USER

router.post(
  "/login",
  login
);


// REFRESH ACCESS TOKEN

router.post(
  "/refresh-token",
  refreshToken
);


// LOGOUT USER

router.post(
  "/logout",
  logout
);


// HEALTH CHECK

router.get(
  "/health",
  (_, res) => {

    res.status(200).json({
      success: true,
      service: "Auth Service",
      status: "UP"
    });

  }
);


export default router;