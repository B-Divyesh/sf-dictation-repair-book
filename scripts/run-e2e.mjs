import { createConnection } from 'node:net';
import { spawn } from 'node:child_process';

const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(executable, ['playwright', 'test', ...process.argv.slice(2)], { stdio: 'inherit' });
const status = await new Promise((resolve, reject) => {
  child.once('error', reject);
  child.once('exit', (code, signal) => resolve(code ?? (signal ? 1 : 0)));
});

const portOpen = (port) => new Promise((resolve) => {
  const socket = createConnection({ host: '127.0.0.1', port });
  socket.once('connect', () => { socket.destroy(); resolve(true); });
  socket.once('error', () => resolve(false));
});

// Playwright owns both strict-port servers. Wait briefly for its explicit
// SIGTERM shutdown, then fail rather than leaving stale previews for a later
// run to unknowingly reuse.
for (let remaining = 20; remaining > 0; remaining--) {
  if (!(await portOpen(4173)) && !(await portOpen(1420))) break;
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (remaining === 1) throw new Error('Playwright preview server did not close on ports 4173 and 1420');
}

process.exitCode = status;
