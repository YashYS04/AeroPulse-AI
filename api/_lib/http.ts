// ============================================================
// api/_lib/http.ts
// Defensive HTTP helpers for Vercel Serverless Functions
// ============================================================

import type { IncomingMessage, ServerResponse } from 'node:http';

export interface VercelLikeRequest extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[]>;
}

export interface VercelLikeResponse extends ServerResponse {
  status?: (statusCode: number) => VercelLikeResponse;
  json?: (data: unknown) => void;
}

export function handleCors(req: IncomingMessage, res: ServerResponse): boolean {
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

export function sendJson(res: VercelLikeResponse, statusCode: number, data: unknown): void {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode);
    res.json(data);
    return;
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export async function parseBody<T = unknown>(req: VercelLikeRequest): Promise<T> {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {} as T;
      }
    }
    return req.body as T;
  }

  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += String(chunk);
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : ({} as T));
      } catch {
        resolve({} as T);
      }
    });
    req.on('error', () => {
      resolve({} as T);
    });
  });
}
