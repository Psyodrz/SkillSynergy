/**
 * Thumbnail Migration Script
 * 
 * This script assigns thumbnails to all existing skills that don't have one.
 * It's idempotent - safe to run multiple times.
 * 
 * Usage: node migrate_thumbnails.js
 */

require('dotenv').config();
const { Pool } = require('pg');
const { pickThumbnail, getThumbnailPath } = require('./utils/thumbnailUtils');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateThumbnails() {
  console.log('🚀 Starting thumbnail migration...\n');

  try {
    // Step 1: Add the thumbnail column if it doesn't exist
    console.log('📋 Ensuring thumbnail column exists...');
    await pool.query(`
      ALTER TABLE skills ADD COLUMN IF NOT EXISTS thumbnail TEXT;
    `);
    console.log('✅ Thumbnail column ready\n');

    // Step 2: Get all skills without thumbnails
    const result = await pool.query(`
      SELECT id, name, category 
      FROM skills 
      WHERE thumbnail IS NULL OR thumbnail = ''
    `);

    const skillsToUpdate = result.rows;
    console.log(`📊 Found ${skillsToUpdate.length} skills without thumbnails\n`);

    if (skillsToUpdate.length === 0) {
      console.log('✅ All skills already have thumbnails. Nothing to do!');
      return;
    }

    // Step 3: Assign thumbnails to each skill
    let updated = 0;
    let failed = 0;

    for (const skill of skillsToUpdate) {
      try {
        const { slug, filename } = pickThumbnail(skill.category);
        const thumbnailPath = `${slug}/${filename}`;

        await pool.query(
          'UPDATE skills SET thumbnail = $1 WHERE id = $2',
          [thumbnailPath, skill.id]
        );

        updated++;
        console.log(`  ✓ ${skill.name} → ${thumbnailPath}`);
      } catch (err) {
        failed++;
        console.error(`  ✗ Failed to update "${skill.name}":`, err.message);
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📦 Total: ${skillsToUpdate.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }

  console.log('\n🎉 Thumbnail migration complete!');
}

// Run the migration
migrateThumbnails().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});
