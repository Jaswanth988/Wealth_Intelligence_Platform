import { Request, Response } from 'express';
import { pool } from '../config/db';

export const createCustomer = async (
  req: Request,
  res: Response
) => {
  const {
    customer_ref,
    full_name,
    email,
    phone,
    pan_number,
    folio_number,
  } = req.body;

  const result = await pool.query(
    `INSERT INTO mf_customers
    (customer_ref, full_name, email, phone,
     pan_number, folio_number)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [
      customer_ref,
      full_name,
      email,
      phone,
      pan_number,
      folio_number,
    ]
  );

  res.status(201).json(result.rows[0]);
};

export const getCustomers = async (
  req: Request,
  res: Response
) => {
  const result = await pool.query(
    'SELECT * FROM mf_customers'
  );

  res.json(result.rows);
};

export const getCustomerById = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  const result = await pool.query(
    'SELECT * FROM mf_customers WHERE customer_ref=$1',
    [id]
  );

  res.json(result.rows[0]);
};