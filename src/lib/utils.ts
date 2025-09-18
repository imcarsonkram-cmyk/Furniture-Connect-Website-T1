import crypto from 'crypto';

export function sanitizeText(s: string) {
  return s.replace(/<[^>]+>/g, '').trim();
}

export function ensureUrl(base: string, path: string) {
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export function hashText(s: string) {
  return crypto.createHash('sha256').update(s).digest('hex');
}
