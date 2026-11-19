// ============================================================
// api/health.ts
// Vercel Serverless Function: Health Check Endpoint
// ============================================================

import type { VercelLikeRequest, VercelLikeResponse } from './_lib/http';
import { handleCors, sendJson } from './_lib/http';

export default function handler(req: VercelLikeRequest, res: VercelLikeResponse): void {
  if (handleCors(req, res)) return;

  sendJson(res, 200, {
    status: 'ok',
    service: 'AeroPulse AI Gateway',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
