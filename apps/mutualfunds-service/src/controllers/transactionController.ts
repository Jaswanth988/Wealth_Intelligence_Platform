import { Request, Response } from 'express';
import { pool } from '../config/db';

export const createTransaction = async (
  req: Request,
  res: Response
) => {
  const {
    customer_ref,
    scheme_code,
    transaction_type,
    amount,
    units,
    nav_at_transaction,
  } = req.body;

  const result = await pool.query(
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
    VALUES ($1,$2,$3,$4,$5,$6,NOW())
    RETURNING *`,
    [
      customer_ref,
      scheme_code,
      transaction_type,
      amount,
      units,
      nav_at_transaction,
    ]
  );

  res.status(201).json(result.rows[0]);
};