// ============================================================
// api/routine-insights.ts
// Vercel Serverless Function: Routine Optimizer Insights
// ============================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import crypto from 'node:crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { RoutineInsight, RoutineHour } from '../src/types/routine';

const ALLOWED_ZONES = new Set([
  'zone-cbd',
  'zone-industrial',
  'zone-greenwood',
  'zone-riverside',
  'zone-transit',
]);

const cache = new Map<string, { data: RoutineInsight; expiresAt: number }>();

function getGenAI(): GoogleGenerativeAI | null {
  const key = process.env.GEMINI_API_KEY || '';
  return key ? new GoogleGenerativeAI(key) : null;
}

function validateParams(persona: unknown, zoneId: unknown): { p: string; z: string } {
  if (typeof persona !== 'string' || persona.trim().length === 0) {
    throw new Error('Invalid or missing persona parameter.');
  }
  if (typeof zoneId !== 'string' || !ALLOWED_ZONES.has(zoneId)) {
    throw new Error(`Invalid zoneId parameter: ${String(zoneId)}`);
  }
  return { p: persona.trim(), z: zoneId };
}

function buildHourlySchedule(persona: string, window: string): RoutineHour[] {
  return [0, 4, 8, 12, 16, 20].map((hour) => {
    const isSafe = hour >= 12 && hour <= 16;
    return {
      hour,
      label: `${String(hour).padStart(2, '0')}:00`,
      predictedAqi: isSafe ? 110 : 280,
      activityRecommendation: isSafe
        ? `Midday Convection Window (${window}) — Safe for ${persona} outdoor errands.`
        : 'Stagnant boundary layer — Keep indoors with active HEPA/Corsi box.',
      isSafeOutdoorWindow: isSafe,
      maskRequired: !isSafe,
      purifierSetting: (isSafe ? 'Eco' : 'Turbo') as 'Eco' | 'Turbo',
    };
  });
}

async function fetchGeminiRoutine(
  genAI: GoogleGenerativeAI,
  persona: string,
  zoneId: string
): Promise<RoutineInsight> {
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const model = genAI.getGenerativeModel({ model: modelName });
  const prompt = `Clinical atmospheric health AI. Persona: "${persona}", Zone: "${zoneId}".
Return JSON only:
{"optimalOutdoorWindow":"1:00 PM – 4:00 PM","clinicalRationale":"Alveolar soot mitigation via solar boundary convection.","sustainableBehaviorAlternatives":["Shift errand timing","Use HEPA 4 ACH","Metro travel"],"projectedExposureReductionPercent":74}`;
  const res = await model.generateContent(prompt);
  const text = res.response.text();
  const match = text.match(/\{[\s\S]*\}/);
  const parsed = match ? JSON.parse(match[0]) : JSON.parse(text);
  const window = parsed.optimalOutdoorWindow || '1:00 PM – 4:00 PM';
  return {
    persona: persona as RoutineInsight['persona'],
    zoneId,
    generatedAt: new Date().toLocaleTimeString(),
    optimalOutdoorWindow: window,
    hourByHour: buildHourlySchedule(persona, window),
    clinicalRationale: parsed.clinicalRationale || 'Midday convection reduces alveolar particulate load.',
    sustainableBehaviorAlternatives: parsed.sustainableBehaviorAlternatives || ['Shift outdoor tasks', 'Filter indoor air'],
    projectedExposureReductionPercent: Number(parsed.projectedExposureReductionPercent) || 74,
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

async function executeRoutineLogic(persona: string, zoneId: string): Promise<RoutineInsight> {
  const cacheKey = crypto.createHash('sha256').update(`${persona}-${zoneId}`).digest('hex').slice(0, 16);
  const entry = cache.get(cacheKey);
  if (entry && entry.expiresAt > Date.now()) return entry.data;

  const genAI = getGenAI();
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  const result = await fetchGeminiRoutine(genAI, persona, zoneId);
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
    const { p, z } = validateParams(body.persona, body.zoneId);
    const result = await executeRoutineLogic(p, z);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Bad Request' }));
  }
}
