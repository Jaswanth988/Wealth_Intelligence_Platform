import { Request, Response } from 'express';
import { pool } from '../config/db';

export const investInFund = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      customer_ref,
      scheme_code,
      invested_amount,
      investment_date,
    } = req.body;

    const schemeResult = await pool.query(
      `SELECT nav_value
       FROM mf_schemes
       WHERE scheme_code=$1`,
      [scheme_code]
    );

    if (schemeResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found',
      });
    }

    const nav = Number(
      schemeResult.rows[0].nav_value
    );

    const units = invested_amount / nav;

    const current_value = invested_amount;

    const fundResult = await pool.query(
      `INSERT INTO mf_customer_funds
      (
        customer_ref,
        scheme_code,
        units,
        invested_amount,
        current_value,
        investment_date
      )
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        customer_ref,
        scheme_code,
        units,
        invested_amount,
        current_value,
        investment_date,
      ]
    );

    await pool.query(
      `INSERT INTO mf_transactions
      (
        customer_ref,
        scheme_code,
        transaction_type,
        amount,
        units,
        nav_at_transaction,
        executed_at
      )
      VALUES (
        $1,$2,
        'PURCHASE',
        $3,$4,$5,
        NOW()
      )`,
      [
        customer_ref,
        scheme_code,
        invested_amount,
        units,
        nav,
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Investment successful',
      data: fundResult.rows[0],
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};