/**
 * One-off helper: push env vars from payment-backend/.env to Vercel production.
 * Run from payment-backend: node fix_envs.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { execSync, spawn } = require('child_process');

const KEYS = [
  'DATABASE_URL',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'RESEND_API_KEY',
  'GOOGLE_AI_API_KEY',
  'HUGGINGFACE_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

for (const key of KEYS) {
  const value = process.env[key];
  if (!value) {
    console.warn(`Skipping ${key} (not set in .env)`);
    continue;
  }
  console.log(`Adding ${key}...`);
  try {
    try {
      execSync(`npx -y vercel env rm ${key} production --yes`, { stdio: 'inherit', shell: true });
    } catch (_) {}
    const child = spawn('npx', ['-y', 'vercel', 'env', 'add', key, 'production'], {
      stdio: ['pipe', 'inherit', 'inherit'],
      shell: true,
    });
    child.stdin.write(value);
    child.stdin.end();
  } catch (err) {
    console.error(`Failed to add ${key}:`, err.message);
  }
}
