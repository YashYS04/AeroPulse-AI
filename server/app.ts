// ============================================================
// server/app.ts
// Express application factory & route definitions for AeroPulse AI
// ============================================================

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  helmetSecurity,
  corsSecurity,
  apiRateLimiter,
  globalErrorHandler,
} from './middleware.js';
import {
  validateZoneId,
  validatePersona,
  validatePrompt,
  validateChatContext,
} from './validators.js';
import {
  generateRoutineWithAI,
  generateChatResponseWithAI,
} from './aiService.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const JSON_PAYLOAD_LIMIT = '15kb';

export const app = express();

app.use(helmetSecurity);
app.use(corsSecurity);
app.use(express.json({ limit: JSON_PAYLOAD_LIMIT }));

app.use((req, _res, next) => {
  if (!req.url.startsWith('/api') && req.url !== '/' && !req.url.startsWith('/assets')) {
    req.url = `/api${req.url}`;
  }
  next();
});

app.get(['/api/health', '/health'], (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AeroPulse AI Gateway',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.post(['/api/routine-insights', '/routine-insights'], apiRateLimiter, async (req, res, next) => {
  try {
    const zoneId = validateZoneId(req.body.zoneId);
    const persona = validatePersona(req.body.persona);
    const insights = await generateRoutineWithAI(persona, zoneId);
    res.json(insights);
  } catch (err) {
    next(err);
  }
});

app.post(['/api/chat-assistant', '/chat-assistant'], apiRateLimiter, async (req, res, next) => {
  try {
    const prompt = validatePrompt(req.body.prompt);
    const context = validateChatContext(req.body.context);
    const response = await generateChatResponseWithAI(prompt, context);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(currentDir, '..', 'dist');
  app.use(express.static(distPath));
  app.get('{*splat}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use(globalErrorHandler);
