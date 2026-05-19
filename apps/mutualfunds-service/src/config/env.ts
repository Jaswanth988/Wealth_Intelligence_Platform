import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  PASSWORD: process.env.PASSWORD || "",
  REDIS_URL: process.env.REDIS_URL || "",
  API_KEY: process.env.API_KEY || "",
  HMAC_SECRET: process.env.HMAC_SECRET || "",
};