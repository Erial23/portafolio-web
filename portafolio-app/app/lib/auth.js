import { cookies } from 'next/headers';
import crypto from 'crypto';

const SECRET = process.env.SESSION_SECRET || 'default-insecure-secret-please-change';

export function signCookie(value) {
  const signature = crypto.createHmac('sha256', SECRET).update(value).digest('hex');
  return `${value}.${signature}`;
}

export function verifyCookie(cookieValue) {
  if (!cookieValue) return false;
  const parts = cookieValue.split('.');
  if (parts.length !== 2) return false;
  const [value, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', SECRET).update(value).digest('hex');
  
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature)) ? value : false;
  } catch (e) {
    return false;
  }
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  
  if (!token) {
    return false;
  }
  
  const value = verifyCookie(token.value);
  return value === 'authenticated';
}
