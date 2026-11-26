#!/usr/bin/env node
/**
 * Cross-platform development launcher for Electron + Vite.
 * Starts Vite dev server on port 3000, waits until ready, and opens Electron
 * pointing to http://127.0.0.1:3000 with hot app shutdown when closed.
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import http from 'node:http';

const require = createRequire(import.meta.url);
const electronBinary = require('electron');

const DEV_PORT = 3000;
const DEV_URL = `http://127.0.0.1:${DEV_PORT}`;

function waitForServer(url, timeoutMs = 45000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const probe = () => {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode && res.statusCode < 500) {
          resolve();
        } else {
          retry();
        }
      });
      req.on('error', retry);
      req.setTimeout(1500, () => {
        req.destroy();
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - started > timeoutMs) {
        reject(new Error(`Timed out waiting for Vite dev server at ${url}`));
        return;
      }
      setTimeout(probe, 300);
    };

    probe();
  });
}

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('[electron:dev] Starting Vite dev server...');
const viteProc = spawn(npmCmd, ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env },
});

let electronProc = null;

const shutdown = (code = 0) => {
  if (electronProc && !electronProc.killed) {
    electronProc.kill();
  }
  if (viteProc && !viteProc.killed) {
    viteProc.kill();
  }
  process.exit(code);
};

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

viteProc.on('exit', (code) => {
  if (!electronProc) {
    console.error(`[electron:dev] Vite exited prematurely with code ${code}`);
    process.exit(code ?? 1);
  }
});

try {
  await waitForServer(DEV_URL);
  console.log('[electron:dev] Launching Electron window...');
  electronProc = spawn(electronBinary, ['.'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      ELECTRON_START_URL: DEV_URL,
    },
  });

  electronProc.on('exit', (code) => {
    shutdown(code ?? 0);
  });
} catch (err) {
  console.error('[electron:dev] Startup error:', err);
  shutdown(1);
}
