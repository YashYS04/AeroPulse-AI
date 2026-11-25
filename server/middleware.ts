// ============================================================
// server/middleware.ts
// Defensive middleware pipeline: Helmet CSP, CORS, & Safe Errors
// ============================================================

import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { ValidationError } from './validators.js';

export const helmetSecurity = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'http://localhost:3001', 'http://localhost:5173'],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
});

export const corsSecurity = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, same-origin)
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS origin unauthorized by AeroPulse policy'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 45, // 45 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment.' },
});

export function globalErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Prevent stack trace and internal upstream error leakage (CWE-209 mitigation)
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(502).json({ error: 'GenAI gateway temporarily unavailable.' });
}
