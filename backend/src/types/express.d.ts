import { AdminPayload } from './index.js';

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

export {};
