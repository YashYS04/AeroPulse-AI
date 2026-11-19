// ============================================================
// src/types/assistant.ts
// Conversational Air Quality Assistant interfaces
// ============================================================

import { VulnerabilityPersona } from './routine';

export type AssistantSender = 'user' | 'assistant' | 'system';

export interface AssistantMessage {
  id: string;
  sender: AssistantSender;
  content: string;
  timestamp: string;
  directImpactSummary?: {
    pm25AvertedMicrograms: number;
    co2AvertedKg: number;
    riskReductionPercent: number;
  };
  recommendedActions?: string[];
  suggestedPromptFollowups?: string[];
}

export interface AssistantPersonaContext {
  persona: VulnerabilityPersona;
  zoneId: string;
  currentAqi: number;
  isInversionActive: boolean;
  hasAirPurifier: boolean;
}
