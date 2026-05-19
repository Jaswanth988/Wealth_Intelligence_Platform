import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import customerRoutes from './routes/customerRoutes';
import fundRoutes from './routes/fundRoutes';
import sipRoutes from './routes/sipRoutes';
import transactionRoutes from './routes/transactionRoutes';
import schemeRoutes from './routes/schemeRoutes';
import healthRoutes from './routes/healthRoutes';

import { limiter } from './middleware/rateLimiter';
import { apiKeyAuth } from './middleware/apiKeyAuth';
import { hmacVerify } from './middleware/hmacVerify';
import { auditLog } from './middleware/auditMiddleware';
import { errorHandler } from './middleware/errorHandler';
import netWorthRoutes from './routes/netWorthRoutes';
import navRoutes from './routes/navRoutes';


import {
  swaggerSpec,
  swaggerUi,
} from './docs/swagger';

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan('dev'));


// Rate Limiting
app.use(limiter);


// Security
app.use(apiKeyAuth);

app.use(hmacVerify);


// Audit Logs
app.use(auditLog);


// Swagger Docs
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


// Routes
app.use('/api/customers', customerRoutes);

app.use('/api/funds', fundRoutes);

app.use('/api/sips', sipRoutes);

app.use('/api/transactions', transactionRoutes);

app.use('/api/schemes', schemeRoutes);

app.use('/api/health', healthRoutes);
app.use('/api/nav', navRoutes);
app.use('/api/networth', netWorthRoutes);
// Global Error Handler
app.use(errorHandler);

export default app;