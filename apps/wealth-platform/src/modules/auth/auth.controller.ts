import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { createAuditLog }
from "../../utils/auditLogger";

const pool = require("../../config/db");

const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET!;

const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET!;



// ======================================================
// REGISTER
// ======================================================

export const register = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      full_name,
      email,
      password,
      role,
      phone,
      pan_number,
      risk_profile
    } = req.body;

    // =====================================
    // CHECK EXISTING USER
    // =====================================

    const existingUserQuery = `
      SELECT *
      FROM unified_investors
      WHERE email = $1
      OR pan_number = $2
    `;

    const existingUser =
      await pool.query(
        existingUserQuery,
        [email, pan_number]
      );

    if (existingUser.rows.length > 0) {

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // =====================================
    // HASH PASSWORD
    // =====================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // =====================================
    // INSERT USER
    // =====================================

    const insertQuery = `
      INSERT INTO unified_investors
      (
        full_name,
        email,
        phone,
        pan_number,
        risk_profile,
        password,
        role
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7)

      RETURNING *
    `;

    const result = await pool.query(
      insertQuery,
      [
        full_name,
        email,
        phone,
        pan_number,
        risk_profile,
        hashedPassword,
        role || "INVESTOR"
      ]
    );

    const unifiedInvestor =
      result.rows[0];

    const unifiedInvestorId =
      unifiedInvestor.id;

    // =====================================
    // EQUITY MAPPING
    // =====================================

    const equityUserQuery = `
      SELECT investor_id
      FROM equity_users
      WHERE pan_number = $1
      OR email = $2
    `;

    const equityUser =
      await pool.query(
        equityUserQuery,
        [pan_number, email]
      );

    if (equityUser.rows.length > 0) {

      const equityInvestorId =
        equityUser.rows[0].investor_id;

      await pool.query(
        `
        INSERT INTO investor_identity_mapping
        (
          unified_investor_id,
          source_system,
          external_investor_id
        )
        VALUES ($1,$2,$3)
        `,
        [
          unifiedInvestorId,
          "EQUITY",
          equityInvestorId
        ]
      );
    }

    // =====================================
    // MF MAPPING
    // =====================================

    const mfUserQuery = `
      SELECT customer_ref
      FROM mf_customers
      WHERE pan_number = $1
      OR email = $2
    `;

    const mfUser =
      await pool.query(
        mfUserQuery,
        [pan_number, email]
      );

    if (mfUser.rows.length > 0) {

      const mfCustomerRef =
        mfUser.rows[0].customer_ref;

      await pool.query(
        `
        INSERT INTO investor_identity_mapping
        (
          unified_investor_id,
          source_system,
          external_investor_id
        )
        VALUES ($1,$2,$3)
        `,
        [
          unifiedInvestorId,
          "MUTUAL_FUND",
          mfCustomerRef
        ]
      );
    }

    // =====================================
    // TOKENS
    // =====================================

    const accessToken = jwt.sign(
      {
        userId: unifiedInvestor.id,
        role: unifiedInvestor.role,
      },
      ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: unifiedInvestor.id,
      },
      REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // =====================================
    // AUDIT LOG
    // =====================================

    await createAuditLog({

      userId: unifiedInvestor.id,

      action: "REGISTER",

      entityType: "AUTH",

      entityId: unifiedInvestor.id,

      newValues: {
        email: unifiedInvestor.email,
        role: unifiedInvestor.role
      },

      ipAddress: req.ip
    });

    // =====================================
    // RESPONSE
    // =====================================

    res.status(201).json({

      success: true,

      message:
        "User registered successfully",

      accessToken,

      refreshToken,

      user: {
        id: unifiedInvestor.id,
        name: unifiedInvestor.full_name,
        email: unifiedInvestor.email,
        role: unifiedInvestor.role
      },

      mappings: {

        equityMapped:
          equityUser.rows.length > 0,

        mutualFundMapped:
          mfUser.rows.length > 0
      }
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// ======================================================
// LOGIN
// ======================================================

export const login = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      email,
      password
    } = req.body;

    const userQuery = `
      SELECT
        id,
        full_name,
        email,
        password,
        role
      FROM unified_investors
      WHERE email = $1
    `;

    const userResult =
      await pool.query(
        userQuery,
        [email]
      );

    if (userResult.rows.length === 0) {

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user =
      userResult.rows[0];

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
      },
      REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await createAuditLog({

      userId: user.id,

      action: "LOGIN",

      entityType: "AUTH",

      entityId: user.id,

      ipAddress: req.ip
    });

    res.status(200).json({

      success: true,

      message: "Login successful",

      accessToken,

      refreshToken,

      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
        role: user.role
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




export const refreshAccessToken =
  async (
    req: Request,
    res: Response
  ) => {

  try {

    const { refreshToken } =
      req.body;

    if (!refreshToken) {

      return res.status(401).json({
        success: false,
        message:
          "Refresh token required",
      });
    }

    const decoded: any =
      jwt.verify(
        refreshToken,
        REFRESH_SECRET
      );

    const accessToken =
      jwt.sign(
        {
          userId:
            decoded.userId,
        },
        ACCESS_SECRET,
        {
          expiresIn: "15m",
        }
      );

    res.status(200).json({
      success: true,
      accessToken,
    });

  } catch (error) {

    res.status(401).json({
      success: false,
      message:
        "Invalid refresh token",
    });
  }
};

export const logout = async (
  req: Request,
  res: Response
) => {

  try {

    res.status(200).json({

      success: true,

      message:
        "Logout successful",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
};


export const me = async (
  req: any,
  res: Response
) => {

  try {

    const userId =
      req.user.userId;

    const query = `
      SELECT
        id,
        full_name,
        email,
        phone,
        pan_number,
        risk_profile,
        role
      FROM unified_investors
      WHERE id = $1
    `;

    const result =
      await pool.query(
        query,
        [userId]
      );

    res.status(200).json({

      success: true,

      user:
        result.rows[0],
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
};