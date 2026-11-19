// ============================================================
// api/routine-insights.ts
// Vercel Serverless Function: Routine Optimizer Insights
// ============================================================

import type { VercelLikeRequest, VercelLikeResponse } from './_lib/http';
import { handleCors, parseBody, sendJson } from './_lib/http';
import { validatePersona, validateZoneId } from './_lib/validators';
import { generateRoutineWithAI } from './_lib/aiService';

export default async function handler(
  req: VercelLikeRequest,
  res: VercelLikeResponse
): Promise<void> {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = await parseBody<{ persona?: unknown; zoneId?: unknown }>(req);
    const persona = validatePersona(body.persona);
    const zoneId = validateZoneId(body.zoneId);
    const insights = await generateRoutineWithAI(persona, zoneId);
    sendJson(res, 200, insights);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bad Request';
    sendJson(res, 400, { error: message });
  }
}
