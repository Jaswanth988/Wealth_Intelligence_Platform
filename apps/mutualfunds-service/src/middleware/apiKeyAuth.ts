import dotenv from 'dotenv';

dotenv.config();

import {
  Request,
  Response,
  NextFunction,
} from 'express';

export const apiKeyAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const apiKey =
    req.headers['x-api-key'];

  console.log('REQUEST KEY:', apiKey);

  console.log(
    'ENV KEY:',
    process.env.MF_API_KEY
  );

  if (
    !apiKey ||
    apiKey !== process.env.MF_API_KEY
  ) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API Key',
    });
  }

  next();
};