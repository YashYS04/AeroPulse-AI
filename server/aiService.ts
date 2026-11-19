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

export async function generateRoutineWithAI(
  persona: VulnerabilityPersona,
  zoneId: string
): Promise<RoutineInsight> {
  const cacheKey = aiResponseCache.hashKey(`routine-${persona}-${zoneId}`);
  const cached = aiResponseCache.get(cacheKey) as RoutineInsight | null;
  if (cached) return cached;

  const genAI = getGenAIClient();
  if (genAI) {
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
      const text = res.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

      const hourByHour = buildHourlySchedule(persona, parsed.optimalOutdoorWindow || '1:00 PM – 4:00 PM');
      const result: RoutineInsight = {
        persona,
        zoneId,
        generatedAt: new Date().toLocaleTimeString(),
        optimalOutdoorWindow: parsed.optimalOutdoorWindow || '1:00 PM – 4:00 PM',
        hourByHour,
        clinicalRationale: parsed.clinicalRationale,
        sustainableBehaviorAlternatives: parsed.sustainableBehaviorAlternatives,
        projectedExposureReductionPercent: parsed.projectedExposureReductionPercent || 74,
        isFallback: false,
      };

      aiResponseCache.set(cacheKey, result);
      return result;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Gemini routine generation error, using resilient fallback:', err instanceof Error ? err.message : err);
    }
  }

  const result = buildHeuristicRoutine(persona, zoneId);
  aiResponseCache.set(cacheKey, result);
  return result;
}

export async function generateChatResponseWithAI(
  prompt: string,
  context: AssistantPersonaContext
): Promise<AssistantMessage> {
  const cacheKey = aiResponseCache.hashKey(`chat-${context.persona}-${context.zoneId}-${prompt}`);
  const cached = aiResponseCache.get(cacheKey) as AssistantMessage | null;
  if (cached) return cached;

  const genAI = getGenAIClient();
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: getModelName() });
      const systemInstruction = `You are AeroPulse AI Copilot advising ${context.persona} in ${context.zoneId} during winter smog (Current AQI: ${context.currentAqi}, Inversion: ${context.isInversionActive ? 'Active' : 'None'}).
Give compassionate, clinical, actionable air safety guidance under 55 words. Mention optimal outdoor hours and indoor CADR.`;

      const res = await model.generateContent(`${systemInstruction}\nUser Question: ${prompt}`);
      const text = res.response.text().trim();

      const result: AssistantMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        content: text,
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

      aiResponseCache.set(cacheKey, result);
      return result;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Gemini chat generation error, using resilient fallback:', err instanceof Error ? err.message : err);
    }
  }

  const result: AssistantMessage = {
    id: `asst-${Date.now()}`,
    sender: 'assistant',
    content: `For ${context.persona} in ${context.zoneId} (AQI ${context.currentAqi}): During winter smog inversions, stay indoors between 6:00 AM – 10:30 AM. Seal doors and run DIY or HEPA filtration (target 4 ACH). Conduct outdoor commutes and errands between 1:00 PM – 4:00 PM when solar convection opens the boundary lid.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    directImpactSummary: {
      pm25AvertedMicrograms: Math.round(context.currentAqi * 0.55),
      co2AvertedKg: 1.4,
      riskReductionPercent: 72,
    },
    recommendedActions: [
      'Equip fitted KF94/N95 respirator outdoors',
      'Avoid unvented heating stoves',
      'Use subterranean metro for cross-city travel',
    ],
    suggestedPromptFollowups: [
      'How to build a Corsi-Rosenthal Box under $45?',
      'Safe window ventilation hours today?',
    ],
  };

  aiResponseCache.set(cacheKey, result);
  return result;
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
