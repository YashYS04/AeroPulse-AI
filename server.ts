// ============================================================
// server.ts
// Defensive Express 5 Backend Gateway for AeroPulse AI
// ============================================================

import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  helmetSecurity,
  corsSecurity,
  apiRateLimiter,
  globalErrorHandler,
} from './server/middleware';
import {
  validateZoneId,
  validatePersona,
  validatePrompt,
} from './server/validators';
import {
  generateRoutineWithAI,
  generateChatResponseWithAI,
} from './server/aiService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT || 3001;

// Defensive Middleware Pipeline
app.use(helmetSecurity);
app.use(corsSecurity);
app.use(express.json({ limit: '15kb' })); // Mitigate memory exhaustion

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AeroPulse AI Gateway',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// GenAI Routine Optimization Endpoint
app.post('/api/routine-insights', apiRateLimiter, async (req, res, next) => {
  try {
    const zoneId = validateZoneId(req.body.zoneId);
    const persona = validatePersona(req.body.persona);
    const insights = await generateRoutineWithAI(persona, zoneId);
    res.json(insights);
  } catch (err) {
    next(err);
  }
});

// Interactive Conversational Assistant Endpoint
app.post('/api/chat-assistant', apiRateLimiter, async (req, res, next) => {
  try {
    const prompt = validatePrompt(req.body.prompt);
    const context = req.body.context || {
      persona: 'Asthmatic Child',
      zoneId: 'zone-cbd',
      currentAqi: 284,
      isInversionActive: true,
      hasAirPurifier: true,
    };
    const response = await generateChatResponseWithAI(prompt, context);
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// Static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('{*splat}', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Global Defensive Error Handler (CWE-209 safe)
app.use(globalErrorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🛡️ AeroPulse AI Gateway running on port ${PORT}`);
  });
}
