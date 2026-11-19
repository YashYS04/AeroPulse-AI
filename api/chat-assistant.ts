// ============================================================
// api/chat-assistant.ts
// Vercel Serverless Function: GenAI Chat Assistant
// ============================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import crypto from 'node:crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AssistantMessage, AssistantPersonaContext } from '../src/types/assistant';

const cache = new Map<string, { data: AssistantMessage; expiresAt: number }>();

function getGenAI(): GoogleGenerativeAI | null {
  const key = process.env.GEMINI_API_KEY || '';
  return key ? new GoogleGenerativeAI(key) : null;
}

function sanitizePrompt(raw: unknown): string {
  if (typeof raw !== 'string') throw new Error('Prompt must be a string.');
  const cleaned = Array.from(raw)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return (code >= 32 && code !== 127) || code === 10 || code === 13;
    })
    .join('')
    .trim()
    .slice(0, 600);
  if (cleaned.length < 2) throw new Error('Prompt must be at least 2 characters.');
  return cleaned;
}

async function fetchGeminiText(
  genAI: GoogleGenerativeAI,
  prompt: string,
  ctx: AssistantPersonaContext
): Promise<string | null> {
  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const model = genAI.getGenerativeModel({ model: modelName });
    const sys = `You are AeroPulse AI Copilot advising ${ctx.persona} in ${ctx.zoneId} during winter smog (Current AQI: ${ctx.currentAqi}, Inversion: ${ctx.isInversionActive ? 'Active' : 'None'}).
Give compassionate, clinical, actionable air safety guidance under 55 words. Mention optimal outdoor hours and indoor CADR.`;
    const res = await model.generateContent(`${sys}\nUser Question: ${prompt}`);
    return res.response.text().trim();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('⚠️ Gemini chat failed, using fallback:', err instanceof Error ? err.message : err);
    return null;
  }
}

function buildResponse(content: string, ctx: AssistantPersonaContext): AssistantMessage {
  return {
    id: `asst-${Date.now()}`,
    sender: 'assistant',
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    directImpactSummary: {
      pm25AvertedMicrograms: Math.round((ctx.currentAqi || 250) * 0.55),
      co2AvertedKg: 1.4,
      riskReductionPercent: 72,
    },
    suggestedPromptFollowups: [
      'What CADR is required for my child room?',
      'How to assemble a Corsi-Rosenthal box under $45?',
    ],
  };
}

async function readJsonBody(req: IncomingMessage & { body?: unknown }): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let acc = '';
    req.on('data', (c) => (acc += String(c)));
    req.on('end', () => {
      try {
        resolve(acc ? JSON.parse(acc) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

async function executeChatLogic(
  prompt: string,
  ctx: AssistantPersonaContext
): Promise<AssistantMessage> {
  const cacheKey = crypto.createHash('sha256').update(`${ctx.persona}-${ctx.zoneId}-${prompt}`).digest('hex').slice(0, 16);
  const entry = cache.get(cacheKey);
  if (entry && entry.expiresAt > Date.now()) return entry.data;

  const genAI = getGenAI();
  const text = genAI ? await fetchGeminiText(genAI, prompt, ctx) : null;
  const fallbackText = `For ${ctx.persona || 'Residents'} in ${ctx.zoneId || 'urban areas'} (AQI ${ctx.currentAqi || 280}): During winter smog inversions, stay indoors between 6:00 AM – 10:30 AM. Seal doors and run DIY or HEPA filtration (target 4 ACH). Conduct outdoor commutes and errands between 1:00 PM – 4:00 PM when solar convection opens the boundary lid.`;
  const result = buildResponse(text || fallbackText, ctx);
  cache.set(cacheKey, { data: result, expiresAt: Date.now() + 10 * 60 * 1000 });
  return result;
}

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }
  try {
    const body = await readJsonBody(req);
    const prompt = sanitizePrompt(body.prompt);
    const ctx = (body.context || {}) as AssistantPersonaContext;
    const result = await executeChatLogic(prompt, ctx);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Bad Request' }));
  }
}
