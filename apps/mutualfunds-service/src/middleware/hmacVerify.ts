import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export const hmacVerify = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let signature = req.headers['x-signature'];
    const timestamp = req.headers['x-timestamp'];

    if (!signature || !timestamp) {
      return res.status(401).json({
        message: 'Missing HMAC headers',
      });
    }

    // Normalize header values (VERY IMPORTANT)
    signature = Array.isArray(signature) ? signature[0] : signature;
    const ts = Array.isArray(timestamp) ? timestamp[0] : timestamp;

    // Ensure body exists
    const body = req.body || {};

    // IMPORTANT: stable stringify (fixes ordering issues)
    const payload = JSON.stringify(sortObject(body));

    const dataToSign = payload + ts;

    const generated = crypto
      .createHmac('sha256', process.env.HMAC_SECRET!)
      .update(dataToSign)
      .digest('hex');

    // Debug logs (remove in prod)
    console.log('BODY:', payload);
    console.log('TIMESTAMP:', ts);
    console.log('GENERATED:', generated);
    console.log('RECEIVED:', signature);

    if (generated !== signature) {
      return res.status(401).json({
        message: 'Invalid signature',
      });
    }

    next();
  } catch (err: any) {
    return res.status(500).json({
      message: 'HMAC verification failed',
      error: err.message,
    });
  }
};

/**
 * 🔐 Ensures consistent object key ordering
 */
function sortObject(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortObject);

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((acc: any, key) => {
        acc[key] = sortObject(obj[key]);
        return acc;
      }, {});
  }

  return obj;
}