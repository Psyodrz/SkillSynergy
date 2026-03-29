/**
 * One-off: set DATABASE_URL on Vercel production from payment-backend/.env
 * Run: node fix_db_url.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { spawn } = require('child_process');

async function addEnv(key, value) {
  return new Promise((resolve, reject) => {
    console.log(`Adding ${key}...`);
    const child = spawn('npx', ['-y', 'vercel', 'env', 'add', key, 'production'], {
      shell: true,
      stdio: ['pipe', 'inherit', 'inherit'],
    });
    child.stdin.write(value + '\n');
    setTimeout(() => {
      try {
        child.stdin.write('n\n');
        child.stdin.end();
      } catch (_) {}
    }, 2000);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Exit code ${code}`));
    });
  });
}

async function run() {
  const val = process.env.DATABASE_URL;
  if (!val) {
    console.error('DATABASE_URL is not set in .env');
    process.exit(1);
  }
  try {
    await addEnv('DATABASE_URL', val);
    console.log('SUCCESS');
  } catch (e) {
    console.error('FAILED', e.message);
  }
}

run();
