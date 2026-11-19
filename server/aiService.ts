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

function buildHeuristicRoutine(persona: VulnerabilityPersona, zoneId: string): RoutineInsight {
  return {
    persona,
    zoneId,
    generatedAt: new Date().toLocaleTimeString(),
    optimalOutdoorWindow: '1:00 PM – 4:00 PM (Solar Convection Lift)',
    hourByHour: buildHourlySchedule(persona, '1:00 PM – 4:00 PM'),
    clinicalRationale: `For ${persona}, ground-level soot inhalation during cold morning inversions irritates bronchial tissues. Midday shifts decrease inhaled particulate mass by over 70%.`,
    sustainableBehaviorAlternatives: [
      'Switch commute from open diesel three-wheelers to underground metro',
      'Run Corsi-Rosenthal DIY box during morning inversion peak',
      'Postpone high-ventilation workouts until midday',
    ],
    projectedExposureReductionPercent: 74,
    isFallback: true,
  };
}

async function fetchGeminiRoutine(
  genAI: GoogleGenerativeAI,
  persona: VulnerabilityPersona,
  zoneId: string
): Promise<RoutineInsight | null> {
  try {
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
      isFallback: false,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('⚠️ Gemini routine generation error:', err instanceof Error ? err.message : err);
    return null;
  }
}

export async function generateRoutineWithAI(
  persona: VulnerabilityPersona,
  zoneId: string
): Promise<RoutineInsight> {
  const cacheKey = aiResponseCache.hashKey(`routine-${persona}-${zoneId}`);
  const cached = aiResponseCache.get(cacheKey) as RoutineInsight | null;
  if (cached) return cached;

  const genAI = getGenAIClient();
  const liveResult = genAI ? await fetchGeminiRoutine(genAI, persona, zoneId) : null;
  const result = liveResult || buildHeuristicRoutine(persona, zoneId);

  aiResponseCache.set(cacheKey, result);
  return result;
}

async function fetchGeminiChat(
  genAI: GoogleGenerativeAI,
  prompt: string,
  context: AssistantPersonaContext
): Promise<string | null> {
  try {
    const model = genAI.getGenerativeModel({ model: getModelName() });
    const sysInstruction = `You are AeroPulse AI Copilot advising ${context.persona} in ${context.zoneId} during winter smog (Current AQI: ${context.currentAqi}, Inversion: ${context.isInversionActive ? 'Active' : 'None'}).
Give compassionate, clinical, actionable air safety guidance under 55 words. Mention optimal outdoor hours and indoor CADR.`;
    const res = await model.generateContent(`${sysInstruction}\nUser Question: ${prompt}`);
    return res.response.text().trim();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('⚠️ Gemini chat generation error:', err instanceof Error ? err.message : err);
    return null;
  }
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
  const text = genAI ? await fetchGeminiChat(genAI, prompt, context) : null;
  const fallbackText = `For ${context.persona} in ${context.zoneId} (AQI ${context.currentAqi}): During winter smog inversions, stay indoors between 6:00 AM – 10:30 AM. Seal doors and run DIY or HEPA filtration (target 4 ACH). Conduct outdoor commutes and errands between 1:00 PM – 4:00 PM when solar convection opens the boundary lid.`;
  const result = buildChatResult(text || fallbackText, context);

  aiResponseCache.set(cacheKey, result);
  return result;
}
