import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const STORAGE_DIR = path.join(process.cwd(), 'storage');
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });

export async function storeImage({ buffer, filename, width, height }: { buffer: Buffer; filename: string; width: number; height: number; }) {
  const hash = crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 12);
  const key = `${Date.now()}-${hash}-${filename}`;
  const full = path.join(STORAGE_DIR, key);
  await fs.promises.writeFile(full, buffer);
  return { key, width, height, hash };
}
