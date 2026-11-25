// ============================================================
// api/chat-assistant.ts
// Vercel Serverless Function: GenAI Chat Assistant
// ============================================================

import type { AssistantPersonaContext } from '../src/types/assistant.js';
import { VulnerabilityPersona } from '../src/types/routine.js';
import { createPostHandler } from './_lib/http.js';
import { validatePrompt } from './_lib/validators.js';
import { generateChatResponseWithAI } from './_lib/aiService.js';

const DEFAULT_CONTEXT: AssistantPersonaContext = {
  persona: VulnerabilityPersona.AsthmaticChild,
  zoneId: 'zone-cbd',
  currentAqi: 284,
  isInversionActive: true,
  hasAirPurifier: true,
};

/** Handles POST requests to the conversational GenAI air quality copilot. */
export default createPostHandler(async (body) => {
  const prompt = validatePrompt(body.prompt);
  const context = (body.context as AssistantPersonaContext | undefined) || DEFAULT_CONTEXT;
  return generateChatResponseWithAI(prompt, context);
});
