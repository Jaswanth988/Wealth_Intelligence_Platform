const db = require('../../config/db');


export const getPropertiesByInvestor = async (
  investorId: string
) => {

  const result = await db.query(`
    SELECT *
    FROM real_estate_assets
    WHERE unified_investor_id = $1
    ORDER BY created_at DESC
  `, [investorId]);

  return result.rows;
};



export const createProperty = async (
  data: any
) => {

  const result = await db.query(`
    INSERT INTO real_estate_assets (
      unified_investor_id,
      property_name,
      property_type,
      address,
      city,
      state,
      purchase_price,
      current_valuation,
      purchase_date,
      ownership_percentage,
      rental_income_monthly,
      occupancy_status
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
    )
    RETURNING *
  `, [
    data.unified_investor_id,
    data.property_name,
    data.property_type,
    data.address,
    data.city,
    data.state,
    data.purchase_price,
    data.current_valuation,
    data.purchase_date,
    data.ownership_percentage,
    data.rental_income_monthly,
    data.occupancy_status
  ]);

  return result.rows[0];
};