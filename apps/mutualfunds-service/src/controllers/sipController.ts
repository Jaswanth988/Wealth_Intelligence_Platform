import { Request, Response } from 'express';
import { pool } from '../config/db';

export const createSIP = async (req: Request, res: Response) => {
  const {
    customer_ref,
    scheme_code,
    sip_amount,
    sip_frequency,
    start_date,
  } = req.body;

  try {
    // 1. Defensive Check: Verify if the Mutual Fund Scheme exists
    const schemeCheck = await pool.query(
      'SELECT scheme_code FROM mf_schemes WHERE scheme_code = $1',
      [scheme_code]
    );

    if (schemeCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_SCHEME_CODE',
        message: `The mutual fund scheme code '${scheme_code}' does not exist in the platform repository.`,
      });
    }

    // 2. Optional: Add a check for customer_ref if you have a users/customers table
    // const customerCheck = await pool.query('SELECT id FROM customers WHERE ref = $1', [customer_ref]);
    // if (customerCheck.rows.length === 0) { ... }

    // 3. Safe to Insert
    const result = await pool.query(
      `INSERT INTO mf_sips 
        (customer_ref, scheme_code, sip_amount, sip_frequency, sip_status, start_date) 
       VALUES ($1, $2, $3, $4, 'ACTIVE', $5) 
       RETURNING *`,
      [customer_ref, scheme_code, sip_amount, sip_frequency, start_date]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
    });

  } catch (error: any) {
    console.error('Error in createSIP:', error);

    // Double safety check for DB constraint violations that bypass the select query
    if (error.code === '23503') {
      return res.status(400).json({
        success: false,
        error: 'FOREIGN_KEY_VIOLATION',
        message: 'Database integrity error: A referenced record does not exist.',
        detail: error.detail
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating SIP record.',
    });
  }
};

export const pauseSIP = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE mf_sips 
       SET sip_status = 'PAUSED' 
       WHERE id = $1 
       RETURNING id`,
      [id]
    );

    // Check if the SIP even existed to be updated
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `SIP record with ID ${id} not found.`,
      });
    }

    return res.json({
      success: true,
      message: 'SIP paused successfully.',
    });

  } catch (error) {
    console.error('Error in pauseSIP:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while pausing SIP record.',
    });
  }
};