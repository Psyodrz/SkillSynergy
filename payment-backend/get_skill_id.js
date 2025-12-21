require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function getSkillId() {
  try {
    const res = await pool.query('SELECT id, name FROM skills LIMIT 1');
    if (res.rows.length > 0) {
      console.log('SKILL_ID:', res.rows[0].id);
      console.log('SKILL_NAME:', res.rows[0].name);
    } else {
        console.log('NO_SKILLS_FOUND');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

getSkillId();
