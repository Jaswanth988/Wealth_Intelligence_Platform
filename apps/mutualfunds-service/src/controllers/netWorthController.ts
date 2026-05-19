import { Request, Response } from 'express';
import { pool } from '../config/db';

export const getNetWorth = async (
  req: Request,
  res: Response
) => {
  try {
    const { investor_id } = req.params;

    // -----------------------------
    // 1. MUTUAL FUND VALUE
    // -----------------------------
    const mfResult = await pool.query(
      `
      SELECT 
        SUM(mf_customer_funds.units * mf_schemes.nav_value) AS mutual_fund_value
      FROM mf_customer_funds
      JOIN mf_schemes 
        ON mf_customer_funds.scheme_code = mf_schemes.scheme_code
      WHERE mf_customer_funds.customer_ref = $1
      `,
      [investor_id]
    );

    const mutualFundValue =
      Number(mfResult.rows[0].mutual_fund_value) || 0;

    // -----------------------------
    // 2. EQUITY HOLDINGS VALUE
    // -----------------------------
    const eqResult = await pool.query(
      `
      SELECT 
        SUM(quantity * current_market_price) AS equity_value
      FROM equity_holdings
      WHERE investor_id = $1
      `,
      [investor_id]
    );

    const equityValue =
      Number(eqResult.rows[0].equity_value) || 0;

    // -----------------------------
    // 3. TOTAL NET WORTH
    // -----------------------------
    const totalNetWorth = mutualFundValue + equityValue;

    // -----------------------------
    // RESPONSE
    // -----------------------------
    res.json({
      success: true,
      investor_id,
      breakdown: {
        mutual_fund_value: mutualFundValue,
        equity_value: equityValue,
      },
      total_net_worth: totalNetWorth,
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};