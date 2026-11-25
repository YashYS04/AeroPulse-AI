// ============================================================
// api/_lib/aiService.ts
// Pure Google Gemini 3.5 Flash Lite GenAI Gateway
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VulnerabilityPersona, RoutineHour, RoutineInsight } from '../../src/types/routine.js';
import type { AssistantMessage, AssistantPersonaContext } from '../../src/types/assistant.js';
import { aiResponseCache } from './cache.js';

const DEFAULT_MODEL = 'gemini-3.5-flash-lite';
const DEFAULT_OUTDOOR_WINDOW = '1:00 PM – 4:00 PM';
const SCHEDULE_HOURS = [0, 4, 8, 12, 16, 20];
const SAFE_WINDOW_START_HOUR = 12;
const SAFE_WINDOW_END_HOUR = 16;
const SAFE_WINDOW_PREDICTED_AQI = 110;
const STAGNANT_PREDICTED_AQI = 280;
const DEFAULT_EXPOSURE_REDUCTION_PCT = 74;
const DEFAULT_CO2_SAVED_KG = 1.4;
const DEFAULT_CHAT_RISK_DROP_PCT = 72;
const PM25_AVERSION_RATIO = 0.55;
const FALLBACK_AQI_BASELINE = 250;
const DEFAULT_FOLLOWUPS = [
  'What CADR is required for my child room?',
  'How to assemble a Corsi-Rosenthal box under $45?',
];

function requireGenAIClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY || '';
  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenerativeAI(key);
}

const getModelName = (): string => process.env.GEMINI_MODEL || DEFAULT_MODEL;

function parseGeminiJson(text: string): Record<string, unknown> {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : text) as Record<string, unknown>;
}

function buildHourlySchedule(persona: VulnerabilityPersona, window: string): RoutineHour[] {
  return SCHEDULE_HOURS.map((hour) => {
    const isSafe = hour >= SAFE_WINDOW_START_HOUR && hour <= SAFE_WINDOW_END_HOUR;
    return {
      hour,
      label: `${String(hour).padStart(2, '0')}:00`,
      predictedAqi: isSafe ? SAFE_WINDOW_PREDICTED_AQI : STAGNANT_PREDICTED_AQI,
      activityRecommendation: isSafe
        ? `Midday Convection Window (${window}) — Safe for ${persona} outdoor errands.`
        : 'Stagnant boundary layer — Keep indoors with active HEPA/Corsi box.',
      isSafeOutdoorWindow: isSafe,
      maskRequired: !isSafe,
      purifierSetting: isSafe ? 'Eco' : 'Turbo',
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
Return JSON only:
{"optimalOutdoorWindow":"${DEFAULT_OUTDOOR_WINDOW}","clinicalRationale":"Brief 1-2 sentence medical explanation of alveolar particulate deposition.","sustainableBehaviorAlternatives":["Shift errand timing","Use HEPA 4 ACH","Metro travel"],"projectedExposureReductionPercent":${DEFAULT_EXPOSURE_REDUCTION_PCT}}`;

  const res = await model.generateContent(prompt);
  const parsed = parseGeminiJson(res.response.text());
  const window = (parsed.optimalOutdoorWindow as string) || DEFAULT_OUTDOOR_WINDOW;

  return {
    persona,
    zoneId,
    generatedAt: new Date().toLocaleTimeString(),
    optimalOutdoorWindow: window,
    hourByHour: buildHourlySchedule(persona, window),
    clinicalRationale: (parsed.clinicalRationale as string) || 'Midday convection reduces bronchial deposition.',
    sustainableBehaviorAlternatives:
      (parsed.sustainableBehaviorAlternatives as string[]) || ['Shift outdoor tasks', 'Use HEPA filtration'],
    projectedExposureReductionPercent:
      Number(parsed.projectedExposureReductionPercent) || DEFAULT_EXPOSURE_REDUCTION_PCT,
  };
}

/**
 * Generates a persona-tailored daily smog resilience schedule via Google Gemini 3.5 Flash Lite,
 * cached with a deterministic SHA-256 key.
 */
export async function generateRoutineWithAI(
  persona: VulnerabilityPersona,
  zoneId: string
): Promise<RoutineInsight> {
  const cacheKey = aiResponseCache.hashKey(`routine-${persona}-${zoneId}`);
  const cached = aiResponseCache.get(cacheKey) as RoutineInsight | null;
  if (cached) return cached;

  const genAI = requireGenAIClient();
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
  const inversionLabel = context.isInversionActive ? 'Active' : 'None';
  const sysInstruction = `You are AeroPulse AI Copilot advising ${context.persona} in ${context.zoneId} during winter smog (Current AQI: ${context.currentAqi}, Inversion: ${inversionLabel}).
Give compassionate, clinical, actionable air safety guidance under 55 words. Mention optimal outdoor hours and indoor CADR.`;

  const res = await model.generateContent(`${sysInstruction}\nUser Question: ${prompt}`);
  return res.response.text().trim();
}

function buildChatResult(content: string, context: AssistantPersonaContext): AssistantMessage {
  return {
    id: `asst-${Date.now()}`,
    sender: 'assistant',
    content,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    directImpactSummary: {
      pm25AvertedMicrograms: Math.round((context.currentAqi || FALLBACK_AQI_BASELINE) * PM25_AVERSION_RATIO),
      co2AvertedKg: DEFAULT_CO2_SAVED_KG,
      riskReductionPercent: DEFAULT_CHAT_RISK_DROP_PCT,
    },
    suggestedPromptFollowups: DEFAULT_FOLLOWUPS,
  };
}

/**
 * Generates a contextual clinical response for the conversational air quality copilot
 * using Google Gemini 3.5 Flash Lite.
 */
export async function generateChatResponseWithAI(
  prompt: string,
  context: AssistantPersonaContext
): Promise<AssistantMessage> {
  const cacheKey = aiResponseCache.hashKey(`chat-${context.persona}-${context.zoneId}-${prompt}`);
  const cached = aiResponseCache.get(cacheKey) as AssistantMessage | null;
  if (cached) return cached;

  const genAI = requireGenAIClient();
  const text = await fetchGeminiChat(genAI, prompt, context);
  const result = buildChatResult(text, context);
  aiResponseCache.set(cacheKey, result);
  return result;
}
