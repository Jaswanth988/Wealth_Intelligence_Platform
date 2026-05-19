import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

import realEstateRoutes from './routes/realEstate.routes';
import authRoutes from './routes/auth.routes';
import wealthRoutes from './routes/wealth.routes';
import healthRoutes
from "./routes/health.routes";
import {
  apiRateLimiter
}
from "./middleware/rateLimit.middleware";
dotenv.config();

const app = express();

app.use(express.json());
app.use(apiRateLimiter);
app.get('/', (_req, res) => {
  res.send('Wealth Platform Running');
});

app.use('/api/properties', realEstateRoutes);

app.use('/api/auth', authRoutes);

app.use("/api/wealth", wealthRoutes);
app.use(
  "/api/health",
  healthRoutes
);
app.get('/dashboard', async (_req, res) => {
  try {

    const equity = await axios.get(
      'http://localhost:4001/health'
    );

    const mf = await axios.get(
      'http://localhost:4002/health'
    );

    res.json({
      wealthPlatform: 'UP',
      equityService: equity.data,
      mfService: mf.data
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: 'One service failed'
    });
  }
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`🚀 Wealth Platform running on ${PORT}`);
});