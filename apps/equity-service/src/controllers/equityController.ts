import { Request, Response } from "express";

import { pool } from "../utility/dbManager";


// BUY STOCK


export const buyStock = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const {
      investor_id,
      stock_symbol,
      company_name,
      quantity,
      price
    } = req.body;

    // VALIDATION

    if (
      !investor_id ||
      !stock_symbol ||
      !company_name ||
      !quantity ||
      !price
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });

    }

    // INSERT TRANSACTION

    await pool.query(
      `
      INSERT INTO equity_transactions
      (
        investor_id,
        stock_symbol,
        transaction_type,
        quantity,
        price,
        executed_at
      )
      VALUES($1, $2, 'BUY', $3, $4, NOW())
      `,
      [
        investor_id,
        stock_symbol,
        quantity,
        price
      ]
    );

    // CHECK HOLDING EXISTS

    const existingHolding =
      await pool.query(
        `
        SELECT * FROM equity_holdings

        WHERE investor_id = $1
        AND stock_symbol = $2
        `,
        [
          investor_id,
          stock_symbol
        ]
      );

    // UPDATE HOLDING

   // UPDATE HOLDING

if (existingHolding.rows.length > 0) {

  const holding =
    existingHolding.rows[0];

  const newQuantity =
    Number(holding.quantity)
    + Number(quantity);

  const newAveragePrice =
    (
      (
        Number(holding.quantity)
        * Number(holding.avg_buy_price)
      )
      +
      (
        Number(quantity)
        * Number(price)
      )
    ) / newQuantity;

  // CALCULATE VALUES

  const investedValue =
    newQuantity * newAveragePrice;

  const currentValue =
    newQuantity * Number(price);

  // UPDATE HOLDING

  await pool.query(
    `
    UPDATE equity_holdings

    SET
    quantity = $1,
    avg_buy_price = $2,
    current_market_price = $3,
    invested_value = $4,
    current_value = $5,
    updated_at = NOW()

    WHERE investor_id = $6
    AND stock_symbol = $7
    `,
    [
      newQuantity,
      newAveragePrice,
      price,
      investedValue,
      currentValue,
      investor_id,
      stock_symbol
    ]
  );

} else {

  // CREATE HOLDING

  const investedValue =
    Number(quantity)
    * Number(price);

  const currentValue =
    Number(quantity)
    * Number(price);

  await pool.query(
    `
    INSERT INTO equity_holdings
    (
      investor_id,
      stock_symbol,
      company_name,
      quantity,
      avg_buy_price,
      current_market_price,
      invested_value,
      current_value
    )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      investor_id,
      stock_symbol,
      company_name,
      quantity,
      price,
      price,
      investedValue,
      currentValue
    ]
  );

}

    return res.status(201).json({
      success: true,
      message: "Stock Purchased Successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Stock Purchase Failed"
    });

  }

};



// GET PORTFOLIO


export const getPortfolio = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const { investorId } =
      req.params;

    // GET HOLDINGS

    const result = await pool.query(
      `
      SELECT

        stock_symbol,
        company_name,
        quantity,
        avg_buy_price,
        current_market_price,
        invested_value,
        current_value

      FROM equity_holdings

      WHERE investor_id = $1
      `,
      [investorId]
    );

    // CALCULATE SUMMARY

    let totalInvestment = 0;

    let totalCurrentValue = 0;

    result.rows.forEach((holding) => {

      totalInvestment +=
        Number(holding.invested_value);

      totalCurrentValue +=
        Number(holding.current_value);

    });

    const totalProfitLoss =
      totalCurrentValue
      - totalInvestment;

    return res.status(200).json({

      success: true,

      investor_id: investorId,

      portfolio: result.rows,

      summary: {

        totalInvestment,

        totalCurrentValue,

        totalProfitLoss

      }

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Failed To Fetch Portfolio"

    });

  }

};



// SELL STOCK


export const sellStock = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const {
      investor_id,
      stock_symbol,
      quantity,
      price
    } = req.body;

    // CHECK HOLDING

    const holdingResult =
      await pool.query(
        `
        SELECT * FROM equity_holdings

        WHERE investor_id = $1
        AND stock_symbol = $2
        `,
        [
          investor_id,
          stock_symbol
        ]
      );

    if (holdingResult.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Holding Not Found"
      });

    }

    const holding =
      holdingResult.rows[0];

    // CHECK QUANTITY

    if (
      Number(quantity)
      > Number(holding.quantity)
    ) {

      return res.status(400).json({
        success: false,
        message: "Insufficient Shares"
      });

    }

    // REMAINING QUANTITY

    const remainingQuantity =
      Number(holding.quantity)
      - Number(quantity);

    // REALIZED GAIN

    const realizedGain =
      (
        Number(price)
        - Number(holding.avg_buy_price)
      ) * Number(quantity);

    // INSERT SELL TRANSACTION

    await pool.query(
      `
      INSERT INTO equity_transactions
      (
        investor_id,
        stock_symbol,
        transaction_type,
        quantity,
        price,
        realized_gain,
        executed_at
      )
      VALUES($1, $2, 'SELL', $3, $4, $5, NOW())
      `,
      [
        investor_id,
        stock_symbol,
        quantity,
        price,
        realizedGain
      ]
    );

    // DELETE HOLDING IF ZERO

    if (remainingQuantity === 0) {

      await pool.query(
        `
        DELETE FROM equity_holdings

        WHERE investor_id = $1
        AND stock_symbol = $2
        `,
        [
          investor_id,
          stock_symbol
        ]
      );

    } else {

      // UPDATE HOLDING

      const investedValue =
  remainingQuantity
  * Number(holding.avg_buy_price);

const currentValue =
  remainingQuantity
  * Number(price);

await pool.query(
  `
  UPDATE equity_holdings

  SET
  quantity = $1,
  current_market_price = $2,
  invested_value = $3,
  current_value = $4,
  updated_at = NOW()

  WHERE investor_id = $5
  AND stock_symbol = $6
  `,
  [
    remainingQuantity,
    price,
    investedValue,
    currentValue,
    investor_id,
    stock_symbol
  ]
);

    }

    return res.status(200).json({
      success: true,
      message: "Stock Sold Successfully",
      realizedGain
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Stock Sell Failed"
    });

  }

};
export const getTransactions = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const { investorId } =
      req.params;

    // FETCH TRANSACTIONS

    const result = await pool.query(
      `
      SELECT *

      FROM equity_transactions

      WHERE investor_id = $1

      ORDER BY executed_at DESC
      `,
      [investorId]
    );

    return res.status(200).json({

      success: true,

      investor_id: investorId,

      transactions: result.rows

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Failed To Fetch Transactions"

    });

  }

};
export const addToWatchlist = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const {
      investor_id,
      stock_symbol
    } = req.body;

    // VALIDATION

    if (
      !investor_id ||
      !stock_symbol
    ) {

      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });

    }

    // INSERT WATCHLIST

    await pool.query(
      `
      INSERT INTO equity_watchlist
      (
        investor_id,
        stock_symbol
      )
      VALUES($1, $2)
      `,
      [
        investor_id,
        stock_symbol
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Added To Watchlist"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed To Add Watchlist"
    });

  }

};

export const getWatchlist = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const { investorId } =
      req.params;

    const result = await pool.query(
      `
      SELECT *

      FROM equity_watchlist

      WHERE investor_id = $1
      `,
      [investorId]
    );

    return res.status(200).json({

      success: true,

      watchlist: result.rows

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Failed To Fetch Watchlist"

    });

  }

};
export const getMarketPrices = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const result = await pool.query(
      `
      SELECT *

      FROM equity_market_prices

      ORDER BY updated_at DESC
      `
    );

    return res.status(200).json({

      success: true,

      market_prices: result.rows

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Failed To Fetch Market Prices"

    });

  }

};
export const getStockPrice = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const { symbol } =
      req.params;

    const result = await pool.query(
      `
      SELECT *

      FROM equity_market_prices

      WHERE stock_symbol = $1
      `,
      [symbol]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Stock Not Found"

      });

    }

    return res.status(200).json({

      success: true,

      stock: result.rows[0]

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Failed To Fetch Stock Price"

    });

  }

};

export const calculateNAV = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const { investorId } =
      req.params;

    const result = await pool.query(
      `
      SELECT
        quantity,
        current_market_price

      FROM equity_holdings

      WHERE investor_id = $1
      `,
      [investorId]
    );

    let totalNAV = 0;

    result.rows.forEach((holding) => {

      totalNAV +=
        Number(holding.quantity)
        *
        Number(
          holding.current_market_price
        );

    });

    return res.status(200).json({

      success: true,

      investor_id: investorId,

      net_asset_value: totalNAV

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Failed To Calculate NAV"

    });

  }

};
export const getAllInvestorsNAV = async (
  req: Request,
  res: Response
): Promise<any> => {

  try {

    const result = await pool.query(
      `
      SELECT
        investor_id,
        SUM(invested_value) AS total_investment,
        SUM(current_value) AS total_current_value

      FROM equity_holdings

      GROUP BY investor_id
      `
    );

    let overallInvestment = 0;

    let overallCurrentValue = 0;

    result.rows.forEach((investor) => {

      overallInvestment +=
        Number(investor.total_investment);

      overallCurrentValue +=
        Number(investor.total_current_value);

    });

    const overallProfitLoss =
      overallCurrentValue
      - overallInvestment;

    return res.status(200).json({

      success: true,

      investors: result.rows,

      summary: {

        overallInvestment,

        overallCurrentValue,

        overallProfitLoss,

        totalNAV: overallCurrentValue

      }

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: "Failed To Fetch NAV"

    });

  }

};