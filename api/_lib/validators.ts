// ============================================================
// api/_lib/validators.ts
// Defense-in-depth parameter sanitization & runtime type guards
// ============================================================

import { VulnerabilityPersona } from '../../src/types/routine.js';

const ALLOWED_ZONES = new Set([
  'zone-cbd',
  'zone-industrial',
  'zone-greenwood',
  'zone-riverside',
  'zone-transit',
]);

const ALLOWED_PERSONAS = new Set<string>(Object.values(VulnerabilityPersona));

/**
 * Strips non-printable ASCII control characters (CWE-20 mitigation) and truncates.
 */
export function sanitizeText(input: unknown, maxLen = 500): string {
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
    throw new Error(`Invalid zoneId parameter. Received: "${String(zoneId)}"`);
  }
  return zoneId;
}

/** Validates that a persona matches one of the supported VulnerabilityPersona profiles. */
export function validatePersona(persona: unknown): VulnerabilityPersona {
  if (typeof persona !== 'string' || !ALLOWED_PERSONAS.has(persona)) {
    throw new Error(`Invalid persona parameter. Received: "${String(persona)}"`);
  }
  return persona as VulnerabilityPersona;
}

/** Sanitizes and enforces minimum length on an incoming GenAI user prompt. */
export function validatePrompt(prompt: unknown): string {
  const sanitized = sanitizeText(prompt, 600);
  if (!sanitized || sanitized.length < 2) {
    throw new Error('Prompt parameter must be at least 2 characters.');
  }
  return sanitized;
}
