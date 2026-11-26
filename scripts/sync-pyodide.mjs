import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sourceDir = path.join(rootDir, 'node_modules', 'pyodide');
const targetDir = path.join(rootDir, 'public', 'pyodide');

const REQUIRED_FILES = [
  'pyodide.js',
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'python_stdlib.zip',
  'pyodide-lock.json',
];

if (!fs.existsSync(sourceDir)) {
  console.error('[sync-pyodide] node_modules/pyodide not found. Run npm install first.');
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

for (const file of REQUIRED_FILES) {
  const src = path.join(sourceDir, file);
  const dst = path.join(targetDir, file);
  if (!fs.existsSync(src)) {
    console.error(`[sync-pyodide] Missing required file: ${src}`);
    process.exit(1);
  }
  fs.copyFileSync(src, dst);
}

console.log(`[sync-pyodide] Synced ${REQUIRED_FILES.length} local Pyodide core files to public/pyodide/`);
