import express from "express";

import {
  buyStock,
  sellStock,
  getPortfolio,
  getTransactions,
  addToWatchlist,
  getWatchlist,
  getMarketPrices,
  getStockPrice,
  getAllInvestorsNAV,
  calculateNAV
} from "../controllers/equityController";

const router = express.Router();


// =========================
// BUY STOCK
// =========================

router.post(
  "/buy",
  buyStock
);


// =========================
// SELL STOCK
// =========================

router.post(
  "/sell",
  sellStock
);


// =========================
// GET PORTFOLIO
// =========================

router.get(
  "/portfolio/:investorId",
  getPortfolio
);


// =========================
// GET TRANSACTIONS
// =========================

router.get(
  "/transactions/:investorId",
  getTransactions
);


// =========================
// ADD WATCHLIST
// =========================

router.post(
  "/watchlist",
  addToWatchlist
);


// =========================
// GET WATCHLIST
// =========================

router.get(
  "/watchlist/:investorId",
  getWatchlist
);


// =========================
// GET MARKET PRICES
// =========================

router.get(
  "/market/prices",
  getMarketPrices
);


// =========================
// GET SINGLE STOCK PRICE
// =========================

router.get(
  "/market/prices/:symbol",
  getStockPrice
);


// =========================
// CALCULATE NAV
// =========================


router.get(
  "/nav",
  getAllInvestorsNAV
);


router.get(
  "/nav/:investorId",
  calculateNAV
);


export default router;
