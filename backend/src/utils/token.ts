import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { AdminPayload } from '../types/index.js';

export const generateAccessToken = (payload: AdminPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as any,
  });
};

export const generateRefreshToken = (payload: AdminPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
};

export const verifyAccessToken = (token: string): AdminPayload | null => {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AdminPayload;
  } catch (err) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): AdminPayload | null => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as AdminPayload;
  } catch (err) {
    return null;
  }
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
