const { Pool } = require('pg');
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  try {
    console.log('Adding settings column to profiles table...');
    await pool.query(`
      ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}';
    `);
    console.log('Migration successful: settings column added.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
