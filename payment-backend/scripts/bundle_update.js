import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const CLIENT_DIR = path.resolve(__dirname, '../../client');
const DIST_DIR = path.join(CLIENT_DIR, 'dist');
const OUTPUT_DIR = path.join(CLIENT_DIR, 'updates');
const OUTPUT_ZIP = path.join(OUTPUT_DIR, 'update.zip');

async function bundleUpdate() {
  console.log('📦 Starting OTA Bundle Process...');

  // 1. Build the project
  console.log('🔨 Building Web Assets...');
  try {
    execSync('npm run build', { cwd: CLIENT_DIR, stdio: 'inherit' });
  } catch (e) {
    console.error('❌ Build failed!');
    process.exit(1);
  }

  // 2. Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  // 3. Zip the dist folder
  console.log('🤐 Zipping dist folder...');
  const output = fs.createWriteStream(OUTPUT_ZIP);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`✅ Bundle created: ${OUTPUT_ZIP} (${archive.pointer()} bytes)`);
    console.log(`\n🚀 NEXT STEP: Upload this file to your Capgo Dashboard to push the update!`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(DIST_DIR, false);
  await archive.finalize();
}

bundleUpdate();
