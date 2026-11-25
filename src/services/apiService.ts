// ============================================================
// src/services/apiService.ts
// Defensive HTTP client for server-side GenAI and analytics
// ============================================================

import { RoutineInsight, VulnerabilityPersona } from '@/types/routine';
import { AssistantMessage, AssistantPersonaContext } from '@/types/assistant';

const BASE_URL = import.meta.env.PROD
  ? ''
  : (import.meta.env.VITE_API_BASE_URL || '');

async function postJson<TResponse>(
  endpoint: string,
  payload: unknown,
  errorLabel: string
): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`${errorLabel}: ${response.statusText}`);
  }

  return response.json() as Promise<TResponse>;
}

/** Requests a persona-tailored daily smog resilience schedule from the GenAI endpoint. */
export async function fetchRoutineInsights(
  persona: VulnerabilityPersona,
  zoneId: string
): Promise<RoutineInsight> {
  return postJson<RoutineInsight>(
    '/api/routine-insights',
    { persona, zoneId },
    'Routine insight request failed'
  );
}

/** Sends a user prompt and active atmospheric context to the GenAI copilot endpoint. */
export async function sendAssistantMessage(
  userPrompt: string,
  context: AssistantPersonaContext
): Promise<AssistantMessage> {
  return postJson<AssistantMessage>(
    '/api/chat-assistant',
    { prompt: userPrompt, context },
    'Assistant chat request failed'
  );
}

/** Verifies liveness and uptime telemetry from the backend gateway health endpoint. */
export async function checkServerHealth(): Promise<{ status: string; uptime: number }> {
  const response = await fetch(`${BASE_URL}/api/health`);
  if (!response.ok) throw new Error('Backend health check failed');
  return response.json() as Promise<{ status: string; uptime: number }>;
}
