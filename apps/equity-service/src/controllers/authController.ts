import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { pool } from "../utility/dbManager";

import {
  signJwt,
  signRefreshJwt,
  verifyRefreshJwt
} from "../utility/authManager";


// =========================
// REGISTER
// =========================

export const register = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const {
      investor_id,
      full_name,
      email,
      pan_number,
      demat_account,
      password
    } = req.body;

    // VALIDATION

    if (
      !investor_id ||
      !full_name ||
      !email ||
      !pan_number ||
      !demat_account ||
      !password
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });

    }

    // CHECK USER EXISTS

    const existingUser = await pool.query(
      `
      SELECT * FROM equity_users
      WHERE email = $1
      `,
      [email]
    );

    if (existingUser.rows.length > 0) {

      return res.status(400).json({
        success: false,
        message: "User already exists"
      });

    }

    // HASH PASSWORD

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // INSERT USER

    const result = await pool.query(
      `
      INSERT INTO equity_users
      (
        investor_id,
        full_name,
        email,
        pan_number,
        demat_account,
        password_hash
      )
      VALUES($1, $2, $3, $4, $5, $6)

      RETURNING
      investor_id,
      full_name,
      email
      `,
      [
        investor_id,
        full_name,
        email,
        pan_number,
        demat_account,
        hashedPassword
      ]
    );

    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: result.rows[0]
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Registration Failed"
    });

  }

};


// =========================
// LOGIN
// =========================

export const login = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const {
      email,
      password
    } = req.body;

    // VALIDATION

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and Password are required"
      });

    }

    // FIND USER

    const result = await pool.query(
      `
      SELECT * FROM equity_users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {

      return res.status(400).json({
        success: false,
        message: "Invalid Email"
      });

    }

    const user = result.rows[0];

    // CHECK PASSWORD

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password_hash
      );

    if (!isPasswordValid) {

      return res.status(400).json({
        success: false,
        message: "Invalid Password"
      });

    }

    // GENERATE ACCESS TOKEN

    const accessToken = signJwt({
      investor_id: user.investor_id,
      email: user.email
    });

    // GENERATE REFRESH TOKEN

    const refreshToken = signRefreshJwt({
      investor_id: user.investor_id
    });

    return res.status(200).json({
      success: true,
      message: "Login Successful",

      accessToken,

      refreshToken,

      user: {
        investor_id: user.investor_id,
        full_name: user.full_name,
        email: user.email
      }
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Login Failed"
    });

  }

};


// =========================
// REFRESH TOKEN
// =========================

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const { refreshToken } = req.body;

    // VALIDATION

    if (!refreshToken) {

      return res.status(401).json({
        success: false,
        message: "Refresh Token Required"
      });

    }

    // VERIFY REFRESH TOKEN

    const decoded: any =
      verifyRefreshJwt(refreshToken);

    if (!decoded) {

      return res.status(403).json({
        success: false,
        message: "Invalid Refresh Token"
      });

    }

    // GENERATE NEW ACCESS TOKEN

    const accessToken = signJwt({
      investor_id: decoded.investor_id
    });

    return res.status(200).json({
      success: true,
      accessToken
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Token Refresh Failed"
    });

  }

};
export const logout = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    return res.status(200).json({

      success: true,

      message: "Logout Successful"

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Logout Failed"

    });

  }

};