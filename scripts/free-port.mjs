import { execSync } from 'node:child_process';

const port = Number(process.argv[2] || 3000);

if (!Number.isInteger(port) || port <= 0) {
  console.error(`[free-port] invalid port: ${process.argv[2] || ''}`);
  process.exit(1);
}

function getPidsByPort(targetPort) {
  try {
    const output = execSync(`lsof -ti tcp:${targetPort} -sTCP:LISTEN`, {
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    }).trim();
    if (!output) return [];
    return output
      .split('\n')
      .map((value) => value.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

const pids = getPidsByPort(port);
if (pids.length === 0) {
  console.log(`[free-port] port ${port} is free`);
  process.exit(0);
}

console.log(`[free-port] releasing port ${port}, pids: ${pids.join(', ')}`);
for (const pid of pids) {
  try {
    process.kill(Number(pid), 'SIGTERM');
  } catch {
    // Ignore already exited or permission errors.
  }
}

setTimeout(() => {
  const remain = getPidsByPort(port);
  for (const pid of remain) {
    try {
      process.kill(Number(pid), 'SIGKILL');
    } catch {
      // Ignore already exited or permission errors.
    }
  }

  const finalRemain = getPidsByPort(port);
  if (finalRemain.length > 0) {
    console.error(`[free-port] failed to release port ${port}: ${finalRemain.join(', ')}`);
    process.exit(1);
  }

  console.log(`[free-port] port ${port} released`);
  process.exit(0);
}, 300);
