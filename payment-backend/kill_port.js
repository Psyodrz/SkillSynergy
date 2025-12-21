const { exec } = require('child_process');

function killPort(port) {
  const command = `netstat -ano | findstr :${port}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`Port ${port} is free (no process found)`);
      return;
    }
    
    const lines = stdout.split('\n');
    lines.forEach(line => {
      if (line.includes('LISTENING')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid) {
          console.log(`Killing PID ${pid} on port ${port}...`);
          exec(`taskkill /F /PID ${pid}`, (e, out, err) => {
            if (e) console.error(`Failed to kill ${pid}:`, e.message);
            else console.log(`Successfully killed ${pid}`);
          });
        }
      }
    });
  });
}

killPort(5000);
