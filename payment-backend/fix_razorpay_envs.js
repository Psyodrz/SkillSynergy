const { spawn } = require('child_process');

async function addEnv(key, value) {
  return new Promise((resolve, reject) => {
    console.log(`Adding ${key}...`);
    const child = spawn('npx', ['-y', 'vercel', 'env', 'add', key, 'production'], {
      shell: true,
      stdio: ['pipe', 'inherit', 'inherit']
    });

    child.stdin.write(value + '\n');
    
    setTimeout(() => {
        try {
            child.stdin.write('n\n');
            child.stdin.end();
        } catch(e) {}
    }, 2000);

    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Exit code ${code}`));
    });
  });
}

async function run() {
    try {
        // Remove existing first
        try { execSync('npx -y vercel env rm RAZORPAY_KEY_ID production --yes', { shell: true }); } catch(e) {}
        try { execSync('npx -y vercel env rm RAZORPAY_KEY_SECRET production --yes', { shell: true }); } catch(e) {}

        // Use LIVE keys from local .env or placeholders
        await addEnv('RAZORPAY_KEY_ID', process.env.RAZORPAY_KEY_ID || 'rzp_live_YOUR_KEY_ID');
        await addEnv('RAZORPAY_KEY_SECRET', process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET');
        console.log('SUCCESS: Razorpay Live Keys Added');
    } catch (e) {
        console.error('FAILED', e.message);
    }
}

const { execSync } = require('child_process');
run();
