import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getSchemeNAV = async (
  req: Request,
  res: Response
) => {
  try {
    const { scheme_code } = req.params;

    const result = await pool.query(
      `
      SELECT 
        scheme_code,
        scheme_name,
        nav_value,
        nav_date
      FROM mf_schemes
      WHERE scheme_code = $1
      `,
      [scheme_code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};