import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types/index.js';

const secret = process.env.JWT_SECRET || 'your-secret-key';
const expiresIn = process.env.JWT_EXPIRE || '7d';

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, secret) as AuthPayload;
  } catch (error) {
    return null;
  }
}

export function decodeToken(token: string): AuthPayload | null {
  try {
    return jwt.decode(token) as AuthPayload | null;
  } catch (error) {
    return null;
  }
}
