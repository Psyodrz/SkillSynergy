require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verify() {
  try {
    console.log('🔍 Verifying Data...');

    // 1. Check Projects for thumbnail_url
    const { rows: projects } = await pool.query(`
      SELECT title, thumbnail_url FROM projects 
      WHERE title IN (
        'SSC CGL: 60-Day Crash Course',
        'UPSC IAS: GS Foundation',
        'JEE Advanced: Mechanics Mastery'
      )
    `);
    
    console.log('\n--- Projects (Checking for SVGs) ---');
    projects.forEach(p => {
      console.log(`[${p.title}] thumbnail_url: ${p.thumbnail_url}`);
    });

    // 2. Check Tasks for content structure
    const { rows: tasks } = await pool.query(`
      SELECT t.title, t.content 
      FROM challenge_tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE p.title = 'SSC CGL: 60-Day Crash Course'
      LIMIT 1
    `);

    console.log('\n--- Task Content (Checking structure) ---');
    if (tasks.length > 0) {
      const t = tasks[0];
      console.log(`[${t.title}] content type: ${typeof t.content}`);
      console.log(`[${t.title}] content is string? ${typeof t.content === 'string'}`);
      if (typeof t.content !== 'string') {
          console.log(`[${t.title}] content.instructions is array? ${Array.isArray(t.content.instructions)}`);
      }
    } else {
        console.log('No tasks found for SSC CGL!');
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    pool.end();
  }
}

verify();
