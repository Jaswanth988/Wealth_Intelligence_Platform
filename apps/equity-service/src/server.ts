import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import equityRoutes from "./routes/equityRoutes";

import { pool } from "./utility/dbManager";

import {
  authenticateUser,
  AuthRequest
} from "./middleware/authMiddleware";

dotenv.config();

const app = express();


// =========================
// MIDDLEWARES
// =========================

app.use(express.json());


// =========================
// ROUTES
// =========================

// AUTH ROUTES

app.use("/auth", authRoutes);


// EQUITY ROUTES

app.use(
  "/equity",
  authenticateUser,
  equityRoutes
);


// =========================
// ROOT ROUTE
// =========================

app.get("/", (_, res) => {

  return res.status(200).json({
    success: true,
    message: "Equity Service Running"
  });

});


// =========================
// HEALTH CHECK
// =========================

app.get("/health", async (_, res) => {

  try {

    await pool.query("SELECT NOW()");

    return res.status(200).json({
      success: true,
      service: "equity-service",
      database: "CONNECTED",
      status: "UP"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      service: "equity-service",
      database: "NOT CONNECTED",
      status: "DOWN"
    });

  }

});


// =========================
// PROTECTED TEST ROUTE
// =========================

app.get(
  "/protected",
  authenticateUser,

  (req: AuthRequest, res) => {

    return res.status(200).json({
      success: true,
      message: "Protected Route Accessed Successfully",

      user: req.user
    });

  }
);


// =========================
// SERVER
// =========================

const PORT =
  process.env.PORT || 4001;

app.listen(PORT, async () => {

  try {

    await pool.query("SELECT NOW()");

    console.log("Supabase Connected");

  } catch (error) {

    console.log("Database Connection Failed");

    console.log(error);

  }

  console.log(
    `Equity Service running on ${PORT}`
  );

});