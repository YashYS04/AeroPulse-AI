// ============================================================
// server/aiService.ts
// Hybrid GenAI gateway: Gemini 3.5 Flash Lite + Resilient Heuristic
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import { VulnerabilityPersona, RoutineInsight } from '../src/types/routine';
import { AssistantMessage, AssistantPersonaContext } from '../src/types/assistant';
import { aiResponseCache } from './cache';

function getGenAIClient(): GoogleGenerativeAI | null {
  const key = process.env.GEMINI_API_KEY || '';
  return key ? new GoogleGenerativeAI(key) : null;
}

const getModelName = () => process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

function parseGeminiRoutineJson(text: string): Record<string, unknown> {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
}

function buildHourlySchedule(persona: VulnerabilityPersona, window: string) {
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
  persona: VulnerabilityPersona,
  zoneId: string
): Promise<RoutineInsight> {
  const model = genAI.getGenerativeModel({ model: getModelName() });
  const prompt = `You are a clinical atmospheric health AI. Persona: "${persona}", Zone: "${zoneId}".
Return a raw JSON object with no markdown formatting:
{
  "optimalOutdoorWindow": "1:00 PM – 4:00 PM",
  "clinicalRationale": "Brief 1-2 sentence medical explanation of alveolar particulate deposition.",
  "sustainableBehaviorAlternatives": ["shift routine", "subway transit", "indoor DIY CADR"],
  "projectedExposureReductionPercent": 74
}`;
  const res = await model.generateContent(prompt);
  const parsed = parseGeminiRoutineJson(res.response.text());
  const window = (parsed.optimalOutdoorWindow as string) || '1:00 PM – 4:00 PM';
  return {
    persona,
    zoneId,
    generatedAt: new Date().toLocaleTimeString(),
    optimalOutdoorWindow: window,
    hourByHour: buildHourlySchedule(persona, window),
    clinicalRationale: (parsed.clinicalRationale as string) || 'Midday convection reduces bronchial deposition.',
    sustainableBehaviorAlternatives: (parsed.sustainableBehaviorAlternatives as string[]) || ['Shift outdoor tasks', 'Use HEPA filtration'],
    projectedExposureReductionPercent: Number(parsed.projectedExposureReductionPercent) || 74,
  };
}

export async function generateRoutineWithAI(
  persona: VulnerabilityPersona,
  zoneId: string
): Promise<RoutineInsight> {
  const cacheKey = aiResponseCache.hashKey(`routine-${persona}-${zoneId}`);
  const cached = aiResponseCache.get(cacheKey) as RoutineInsight | null;
  if (cached) return cached;

  const genAI = getGenAIClient();
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  const result = await fetchGeminiRoutine(genAI, persona, zoneId);
  aiResponseCache.set(cacheKey, result);
  return result;
}

async function fetchGeminiChat(
  genAI: GoogleGenerativeAI,
  prompt: string,
  context: AssistantPersonaContext
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: getModelName() });
  const sysInstruction = `You are AeroPulse AI Copilot advising ${context.persona} in ${context.zoneId} during winter smog (Current AQI: ${context.currentAqi}, Inversion: ${context.isInversionActive ? 'Active' : 'None'}).
Give compassionate, clinical, actionable air safety guidance under 55 words. Mention optimal outdoor hours and indoor CADR.`;
  const res = await model.generateContent(`${sysInstruction}\nUser Question: ${prompt}`);
  return res.response.text().trim();
}

function buildChatResult(
  content: string,
  context: AssistantPersonaContext
): AssistantMessage {
  return {
    id: `asst-${Date.now()}`,
    sender: 'assistant',
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    directImpactSummary: {
      pm25AvertedMicrograms: Math.round(context.currentAqi * 0.55),
      co2AvertedKg: 1.4,
      riskReductionPercent: 72,
    },
    suggestedPromptFollowups: [
      'What CADR is required for my child room?',
      'How to assemble a Corsi-Rosenthal box under $45?',
    ],
  };
}

export async function generateChatResponseWithAI(
  prompt: string,
  context: AssistantPersonaContext
): Promise<AssistantMessage> {
  const cacheKey = aiResponseCache.hashKey(`chat-${context.persona}-${context.zoneId}-${prompt}`);
  const cached = aiResponseCache.get(cacheKey) as AssistantMessage | null;
  if (cached) return cached;

  const genAI = getGenAIClient();
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  const text = await fetchGeminiChat(genAI, prompt, context);
  const result = buildChatResult(text, context);
  aiResponseCache.set(cacheKey, result);
  return result;
}
