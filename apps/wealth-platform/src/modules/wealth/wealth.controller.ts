import { Request, Response } from "express";
import axios from "axios";

const pool = require("../../config/db");

import redisClient from "../../config/redis";

export const getWealthSummary = async (
  req: Request,
  res: Response
) => {

  try {

    const { investorId } = req.params;
    const cacheKey =
      `wealth:${investorId}`;
    const cachedData =
      await redisClient.get(cacheKey);

    if (cachedData) {

      console.log("✅ Returning from Redis Cache");

      return res.status(200).json({
        success: true,
        source: "REDIS_CACHE",
        data: JSON.parse(cachedData)
      });
    }

    console.log("❌ Cache Miss");
    const mappingQuery = `
      SELECT
        source_system,
        external_investor_id
      FROM investor_identity_mapping
      WHERE unified_investor_id = $1
    `;

    const mappingResult = await pool.query(
      mappingQuery,
      [investorId]
    );

    let equityInvestorId: string | null = null;
    let mfInvestorId: string | null = null;

    mappingResult.rows.forEach((row: any) => {

      if (row.source_system === "EQUITY") {

        equityInvestorId =
          row.external_investor_id;
      }

      if (row.source_system === "MUTUAL_FUND") {

        mfInvestorId =
          row.external_investor_id;
      }

    });
    const realEstateQuery = `
      SELECT
      COALESCE(SUM(current_valuation),0)
      AS total_real_estate
      FROM real_estate_assets
      WHERE unified_investor_id = $1
    `;

    const realEstateResult = await pool.query(
      realEstateQuery,
      [investorId]
    );

    const realEstateValue =
      Number(
        realEstateResult.rows[0]
        .total_real_estate
      ) || 0;

    const results = await Promise.allSettled([

      equityInvestorId
        ? axios.get(
            `http://localhost:4001/api/equity/${equityInvestorId}/summary`
          )
        : Promise.resolve({
            data: {
              totalValue: 0
            }
          }),

      mfInvestorId
        ? axios.get(
            `http://localhost:4002/api/mf/${mfInvestorId}/summary`
          )
        : Promise.resolve({
            data: {
              totalValue: 0
            }
          })

    ]);

    let equityValue = 0;

    if (
      results[0].status === "fulfilled"
    ) {

      equityValue =
        results[0].value.data.totalValue || 0;
    }
    let mutualFundValue = 0;

    if (
      results[1].status === "fulfilled"
    ) {

      mutualFundValue =
        results[1].value.data.totalValue || 0;
    }
    const totalWealth =
      equityValue +
      mutualFundValue +
      realEstateValue;
    const responseData = {

      unifiedInvestorId: investorId,

      mappedAccounts: {
        equityInvestorId,
        mfInvestorId
      },

      wealthBreakdown: {

        equityValue,

        mutualFundValue,

        realEstateValue,

        totalWealth
      }

    };

    await redisClient.set(
      cacheKey,
      JSON.stringify(responseData),
      {
        EX: 300
      }
    );

    console.log("✅ Stored in Redis");
    await pool.query(
      `
      INSERT INTO aggregated_wealth
      (
        unified_investor_id,
        equity_value,
        mutual_fund_value,
        real_estate_value
      )
      VALUES ($1,$2,$3,$4)
      `,
      [
        investorId,
        equityValue,
        mutualFundValue,
        realEstateValue
      ]
    );
    res.status(200).json({

      success: true,

      source: "DATABASE_AND_SERVICES",

      data: responseData

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};