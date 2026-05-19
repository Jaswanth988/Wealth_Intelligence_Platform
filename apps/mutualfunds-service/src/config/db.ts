import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // REQUIRED for Supabase
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection properly
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL Connected Successfully');

    const result = await client.query('SELECT NOW()');
    console.log('DB Time:', result.rows[0]);

    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL Connection Error:', err);
  }
})();