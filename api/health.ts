// ============================================================
// api/health.ts
// Vercel Serverless Function: Health Check Endpoint
// ============================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import { applyCorsAndPreflight, sendJson } from './_lib/http.js';

/** Handles GET health checks for the serverless AI gateway. */
export default function handler(req: IncomingMessage, res: ServerResponse): void {
  if (applyCorsAndPreflight(req, res)) return;

  sendJson(res, 200, {
    status: 'ok',
    service: 'AeroPulse AI Gateway',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
