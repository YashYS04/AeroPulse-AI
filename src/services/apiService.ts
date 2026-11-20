// ============================================================
// src/services/apiService.ts
// Defensive HTTP client for server-side GenAI and analytics
// ============================================================

import { RoutineInsight, VulnerabilityPersona } from '@/types/routine';
import { AssistantMessage, AssistantPersonaContext } from '@/types/assistant';

const BASE_URL = import.meta.env.PROD
  ? ''
  : (import.meta.env.VITE_API_BASE_URL || '');

export async function fetchRoutineInsights(
  persona: VulnerabilityPersona,
  zoneId: string
): Promise<RoutineInsight> {
  const response = await fetch(`${BASE_URL}/api/routine-insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ persona, zoneId }),
  });

  if (!response.ok) {
    throw new Error(`Routine insight request failed: ${response.statusText}`);
  }

  return response.json() as Promise<RoutineInsight>;
}

export async function sendAssistantMessage(
  userPrompt: string,
  context: AssistantPersonaContext
): Promise<AssistantMessage> {
  const response = await fetch(`${BASE_URL}/api/chat-assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userPrompt, context }),
  });

  if (!response.ok) {
    throw new Error(`Assistant chat request failed: ${response.statusText}`);
  }

  return response.json() as Promise<AssistantMessage>;
}

export async function checkServerHealth(): Promise<{ status: string; uptime: number }> {
  const response = await fetch(`${BASE_URL}/api/health`);
  if (!response.ok) throw new Error('Backend health check failed');
  return response.json();
}
