import { Request, Response } from 'express';
import { pool } from '../config/db';
import redis from '../config/redis';
import { fetchNAV } from '../services/navCalculatorService';

export const getSchemes = async (
  req: Request,
  res: Response
) => {
  try {

    const cachedSchemes = await redis.get(
      'mf_schemes'
    );

    if (cachedSchemes) {
      return res.json({
        success: true,
        source: 'redis-cache',
        data: JSON.parse(cachedSchemes),
      });
    }

    const result = await pool.query(
      'SELECT * FROM mf_schemes'
    );

    await redis.set(
      'mf_schemes',
      JSON.stringify(result.rows),
      'EX',
      60
    );

    res.json({
      success: true,
      source: 'postgresql',
      data: result.rows,
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getSchemeByCode = async (
  req: Request,
  res: Response
) => {
  try {

    const { schemeCode } = req.params;

    const cacheKey = `scheme_${schemeCode}`;

    const cachedScheme = await redis.get(
      cacheKey
    );

    if (cachedScheme) {
      return res.json({
        success: true,
        source: 'redis-cache',
        data: JSON.parse(cachedScheme),
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM mf_schemes
       WHERE scheme_code=$1`,
      [schemeCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }

    await redis.set(
      cacheKey,
      JSON.stringify(result.rows[0]),
      'EX',
      60
    );

    res.json({
      success: true,
      source: 'postgresql',
      data: result.rows[0],
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const updateNAV = async (
  req: Request,
  res: Response
) => {
  try {

    const { schemeCode } = req.params;

    // simulate external NAV provider
    const navData = await fetchNAV();

    const updated = await pool.query(
      `UPDATE mf_schemes
       SET nav_value=$1,
           nav_date=CURRENT_DATE
       WHERE scheme_code=$2
       RETURNING *`,
      [
        navData.nav,
        schemeCode,
      ]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }

    // clear redis cache
    await redis.del('mf_schemes');

    await redis.del(
      `scheme_${schemeCode}`
    );

    res.json({
      success: true,
      message: 'NAV updated successfully',
      data: updated.rows[0],
    });

  } catch (error: any) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};