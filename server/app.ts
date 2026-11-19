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
} from './middleware';
import {
  validateZoneId,
  validatePersona,
  validatePrompt,
} from './validators';
import {
  generateRoutineWithAI,
  generateChatResponseWithAI,
} from './aiService';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Defensive Middleware Pipeline
app.use(helmetSecurity);
app.use(corsSecurity);
app.use(express.json({ limit: '15kb' })); // Mitigate memory exhaustion

// Route normalization for serverless environments (e.g. Vercel)
app.use((req, _res, next) => {
  if (!req.url.startsWith('/api') && req.url !== '/' && !req.url.startsWith('/assets')) {
    req.url = '/api' + req.url;
  }
  next();
});

// Health Check
app.get(['/api/health', '/health'], (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AeroPulse AI Gateway',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// GenAI Routine Optimization Endpoint
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

// Interactive Conversational Assistant Endpoint
app.post(['/api/chat-assistant', '/chat-assistant'], apiRateLimiter, async (req, res, next) => {
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

// Static files in production standalone mode
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('{*splat}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Global Defensive Error Handler (CWE-209 safe)
app.use(globalErrorHandler);
