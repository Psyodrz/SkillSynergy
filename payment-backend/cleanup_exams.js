/**
 * Cleanup Exam Projects
 * Deletes the exam projects created by the seeder so we can re-seed with better content.
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const TITLES_TO_DELETE = [
  'SSC CGL: 60-Day Crash Course',
  'UPSC IAS: GS Foundation',
  'JEE Advanced: Mechanics Mastery',
  'NEET Biology: Human Physiology',
  'Police Constable Training Prep',
  'Banking PO: Data Interpretation'
];

async function cleanup() {
  console.log('🧹 Starting Cleanup...');
  try {
    for (const title of TITLES_TO_DELETE) {
      const res = await pool.query('DELETE FROM projects WHERE title = $1', [title]);
      console.log(`   - Deleted "${title}": ${res.rowCount} rows`);
    }
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    pool.end();
  }
}

cleanup();
