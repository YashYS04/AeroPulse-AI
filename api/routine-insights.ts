// ============================================================
// api/routine-insights.ts
// Vercel Serverless Function: Routine Optimizer Insights
// ============================================================

import { createPostHandler } from './_lib/http.js';
import { validatePersona, validateZoneId } from './_lib/validators.js';
import { generateRoutineWithAI } from './_lib/aiService.js';

/** Handles POST requests for GenAI persona-specific daily routines. */
export default createPostHandler(async (body) => {
  const persona = validatePersona(body.persona);
  const zoneId = validateZoneId(body.zoneId);
  return generateRoutineWithAI(persona, zoneId);
});
