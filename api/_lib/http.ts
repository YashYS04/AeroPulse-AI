// ============================================================
// api/_lib/http.ts
// Hardened HTTP/CORS/Rate-Limit/Payload wrappers for Vercel
// ============================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import { ValidationError } from './validators.js';

export interface ServerlessRequest extends IncomingMessage {
  body?: unknown;
}

const MAX_BODY_BYTES = 15 * 1024;
const RATE_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 45;
const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/airpromtwars\.vercel\.app$/,
  /^https:\/\/airpromtwars-[a-z0-9-]+-yashys04s-projects\.vercel\.app$/,
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
];

const ipRequestLog = new Map<string, number[]>();

class PayloadTooLargeError extends Error {
  constructor() {
    super('Request payload exceeds 15KB limit.');
    this.name = 'PayloadTooLargeError';
  }
}

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true;
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(origin));
}

function applySecurityHeaders(res: ServerResponse, origin: string | undefined): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  res.setHeader('Vary', 'Origin');
  if (origin && isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
}

function isRateLimited(req: IncomingMessage): boolean {
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim()
    || req.socket?.remoteAddress
    || 'unknown';

  const now = Date.now();
  const windowStart = now - RATE_WINDOW_MS;
  const recent = (ipRequestLog.get(clientIp) || []).filter((ts) => ts > windowStart);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestLog.set(clientIp, recent);
    return true;
  }
  recent.push(now);
  ipRequestLog.set(clientIp, recent);
  return false;
}

/** Applies OWASP security headers, CORS allowlist validation, and preflight handling. */
export function applyCorsAndPreflight(req: IncomingMessage, res: ServerResponse): boolean {
  const originHeader = typeof req.headers.origin === 'string' ? req.headers.origin : undefined;
  applySecurityHeaders(res, originHeader);

  if (!isOriginAllowed(originHeader)) {
    sendJson(res, 403, { error: 'CORS origin unauthorized by AeroPulse policy' });
    return true;
  }
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return true;
  }
  return false;
}

/** Serializes a JSON payload with explicit HTTP status and Content-Type headers. */
export function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

/** Reads and parses a bounded (<= 15KB) JSON request body to prevent CWE-400 exhaustion. */
export async function readJsonBody(req: ServerlessRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body, 'utf8') > MAX_BODY_BYTES) throw new PayloadTooLargeError();
    return JSON.parse(req.body || '{}') as Record<string, unknown>;
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    let bytes = 0;
    req.on('data', (chunk) => {
      bytes += Buffer.byteLength(String(chunk), 'utf8');
      if (bytes > MAX_BODY_BYTES) {
        reject(new PayloadTooLargeError());
        return;
      }
      raw += String(chunk);
    });
    req.on('end', () => {
      try {
        resolve(raw ? (JSON.parse(raw) as Record<string, unknown>) : {});
      } catch {
        reject(new ValidationError('Malformed JSON payload.'));
      }
    });
    req.on('error', () => reject(new ValidationError('Failed to read request body.')));
  });
}

/**
 * Wraps a POST handler with CORS allowlist, rate limiting, 15KB body bounds,
 * and CWE-209 safe error responses.
 */
export function createPostHandler<TResult>(
  handlerFn: (body: Record<string, unknown>) => Promise<TResult>
): (req: ServerlessRequest, res: ServerResponse) => Promise<void> {
  return async (req: ServerlessRequest, res: ServerResponse): Promise<void> => {
    if (applyCorsAndPreflight(req, res)) return;
    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Method Not Allowed' });
      return;
    }
    if (isRateLimited(req)) {
      sendJson(res, 429, { error: 'Too many requests. Please wait a moment.' });
      return;
    }
    try {
      const body = await readJsonBody(req);
      const result = await handlerFn(body);
      sendJson(res, 200, result);
    } catch (err) {
      if (err instanceof PayloadTooLargeError) {
        sendJson(res, 413, { error: err.message });
        return;
      }
      if (err instanceof ValidationError) {
        sendJson(res, 400, { error: err.message });
        return;
      }
      sendJson(res, 502, { error: 'GenAI gateway temporarily unavailable.' });
    }
  };
}
