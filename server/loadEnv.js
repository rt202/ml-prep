import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseDotEnv(content) {
  const result = {};
  const lines = content.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

function loadFileIntoProcessEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const parsed = parseDotEnv(fs.readFileSync(filePath, 'utf-8'));
  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

export function loadServerEnv() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const candidates = [
    join(__dirname, `.env.${nodeEnv}`),
    join(__dirname, '.env'),
  ];
  for (const filePath of candidates) loadFileIntoProcessEnv(filePath);
}

loadServerEnv();
