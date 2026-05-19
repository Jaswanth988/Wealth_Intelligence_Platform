const crypto = require('crypto');

const body = JSON.stringify({
  customer_ref: "CUST002",
  scheme_code: "SCH001",
  invested_amount: 10000,
  investment_date: "2026-05-19"
});

const timestamp = "1716110000";
const secret = "MF_HMAC_SECRET";

const signature = crypto
  .createHmac("sha256", secret)
  .update(body + timestamp)
  .digest("hex");

console.log("SIGNATURE:", signature);