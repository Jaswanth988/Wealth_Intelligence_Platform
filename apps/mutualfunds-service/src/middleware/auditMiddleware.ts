import {
  Request,
  Response,
  NextFunction,
} from 'express';

import { pool } from '../config/db';

export const auditLog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    await pool.query(
      `INSERT INTO api_request_logs
      (
        service_name,
        endpoint,
        request_method
      )

      VALUES ($1,$2,$3)`,
      [
        'mf-service',
        req.originalUrl,
        req.method,
      ]
    );

    next();

  } catch (error) {

    next(error);

  }
};