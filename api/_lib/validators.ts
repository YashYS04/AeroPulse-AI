// ============================================================
// api/_lib/validators.ts
// Defense-in-depth parameter sanitization & runtime type guards
// ============================================================

import type { AssistantPersonaContext } from '../../src/types/assistant.js';
import { VulnerabilityPersona } from '../../src/types/routine.js';

const ALLOWED_ZONES = new Set([
  'zone-cbd',
  'zone-industrial',
  'zone-greenwood',
  'zone-riverside',
  'zone-transit',
]);

const ALLOWED_PERSONAS = new Set<string>(Object.values(VulnerabilityPersona));
const MIN_PROMPT_LENGTH = 2;
const MAX_PROMPT_LENGTH = 600;
const MAX_AQI_VALUE = 500;

/** Error subclass for client input failures safe to surface as HTTP 400 (CWE-209). */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Strips non-printable ASCII control characters (CWE-20 mitigation) and truncates.
 */
export function sanitizeText(input: unknown, maxLen = MAX_AQI_VALUE): string {
  if (typeof input !== 'string') return '';
  const cleaned = Array.from(input)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return (code >= 32 && code !== 127) || code === 10 || code === 13;
    })
    .join('')
    .trim();
  return cleaned.slice(0, maxLen);
}

/** Validates that a zone identifier belongs to the configured urban telemetry sectors. */
export function validateZoneId(zoneId: unknown): string {
  if (typeof zoneId !== 'string' || !ALLOWED_ZONES.has(zoneId)) {
    throw new ValidationError(`Invalid zoneId parameter. Received: "${String(zoneId)}"`);
  }
  return zoneId;
}

/** Validates that a persona matches one of the supported VulnerabilityPersona profiles. */
export function validatePersona(persona: unknown): VulnerabilityPersona {
  if (typeof persona !== 'string' || !ALLOWED_PERSONAS.has(persona)) {
    throw new ValidationError(`Invalid persona parameter. Received: "${String(persona)}"`);
  }
  return persona as VulnerabilityPersona;
}

/** Sanitizes and enforces length bounds on an incoming GenAI user prompt. */
export function validatePrompt(prompt: unknown): string {
  const sanitized = sanitizeText(prompt, MAX_PROMPT_LENGTH);
  if (!sanitized || sanitized.length < MIN_PROMPT_LENGTH) {
    throw new ValidationError('Prompt parameter must be at least 2 characters.');
  }
  return sanitized;
}

/**
 * Validates and normalizes untrusted assistant context payloads to prevent
 * LLM prompt injection via forged persona, zone, or telemetry values.
 */
export function validateChatContext(rawContext: unknown): AssistantPersonaContext {
  if (!rawContext || typeof rawContext !== 'object') {
    return {
      persona: VulnerabilityPersona.AsthmaticChild,
      zoneId: 'zone-cbd',
      currentAqi: 284,
      isInversionActive: true,
      hasAirPurifier: true,
    };
  }

  const ctx = rawContext as Record<string, unknown>;
  const persona = validatePersona(ctx.persona);
  const zoneId = validateZoneId(ctx.zoneId);
  const aqi = Number(ctx.currentAqi);

  if (!Number.isFinite(aqi) || aqi < 0 || aqi > MAX_AQI_VALUE) {
    throw new ValidationError(`Invalid currentAqi parameter. Must be between 0 and ${MAX_AQI_VALUE}.`);
  }

  return {
    persona,
    zoneId,
    currentAqi: Math.round(aqi),
    isInversionActive: Boolean(ctx.isInversionActive),
    hasAirPurifier: Boolean(ctx.hasAirPurifier),
  };
}
