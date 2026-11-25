// ============================================================
// api/_lib/http.ts
// Shared HTTP/CORS/JSON lifecycle wrappers for Vercel functions
// ============================================================

import type { IncomingMessage, ServerResponse } from 'node:http';

export interface ServerlessRequest extends IncomingMessage {
  body?: unknown;
}

/** Applies standard CORS headers and responds immediately to OPTIONS preflight requests. */
export function applyCorsAndPreflight(req: IncomingMessage, res: ServerResponse): boolean {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
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

/** Reads and parses a JSON request body across pre-parsed and raw stream runtimes. */
export async function readJsonBody(req: ServerlessRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += String(chunk);
    });
    req.on('end', () => {
      try {
        resolve(raw ? (JSON.parse(raw) as Record<string, unknown>) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

/**
 * Wraps a domain POST handler with CORS preflight, method guarding, body parsing,
 * and safe CWE-209 error responses.
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
    try {
      const body = await readJsonBody(req);
      const result = await handlerFn(body);
      sendJson(res, 200, result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bad Request';
      sendJson(res, 400, { error: message });
    }
  };
}
