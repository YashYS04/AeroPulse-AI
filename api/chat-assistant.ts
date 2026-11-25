// ============================================================
// api/chat-assistant.ts
// Vercel Serverless Function: GenAI Chat Assistant
// ============================================================

import { createPostHandler } from './_lib/http.js';
import { validateChatContext, validatePrompt } from './_lib/validators.js';
import { generateChatResponseWithAI } from './_lib/aiService.js';

/** Handles POST requests to the conversational GenAI air quality copilot. */
export default createPostHandler(async (body) => {
  const prompt = validatePrompt(body.prompt);
  const context = validateChatContext(body.context);
  return generateChatResponseWithAI(prompt, context);
});
