// ============================================================
// api/chat-assistant.ts
// Vercel Serverless Function: GenAI Chat Assistant
// ============================================================

import type { VercelLikeRequest, VercelLikeResponse } from './_lib/http';
import { handleCors, parseBody, sendJson } from './_lib/http';
import { validatePrompt } from './_lib/validators';
import { generateChatResponseWithAI } from './_lib/aiService';
import { AssistantPersonaContext } from '../src/types/assistant';
import { VulnerabilityPersona } from '../src/types/routine';

const DEFAULT_CONTEXT: AssistantPersonaContext = {
  persona: VulnerabilityPersona.AsthmaticChild,
  zoneId: 'zone-cbd',
  currentAqi: 284,
  isInversionActive: true,
  hasAirPurifier: true,
};

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
    const body = await parseBody<{ prompt?: unknown; context?: AssistantPersonaContext }>(req);
    const prompt = validatePrompt(body.prompt);
    const context = body.context || DEFAULT_CONTEXT;
    const response = await generateChatResponseWithAI(prompt, context);
    sendJson(res, 200, response);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Bad Request';
    sendJson(res, 400, { error: message });
  }
}
