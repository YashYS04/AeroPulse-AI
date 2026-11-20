// ============================================================
// src/test/api.test.ts
// Live Backend Gateway, Type Guards, Cache & Security Verification
// ============================================================

import { describe, it, expect, vi } from 'vitest';

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockImplementation(async (prompt: string) => {
        if (typeof prompt === 'string' && prompt.includes('User Question:')) {
          return {
            response: {
              text: () => 'Equip fitted N95 respirator outdoors. Shift exercise to midday convection window.',
            },
          };
        }
        return {
          response: {
            text: () =>
              JSON.stringify({
                optimalOutdoorWindow: '1:00 PM – 4:00 PM',
                clinicalRationale: 'Midday solar convection breaks the surface inversion cap.',
                sustainableBehaviorAlternatives: ['Shift outdoor errands', 'Use HEPA filtration', 'Use subway'],
                projectedExposureReductionPercent: 74,
              }),
          },
        };
      }),
    }),
  })),
}));
import {
  validateZoneId,
  validatePersona,
  validatePrompt,
  sanitizeText,
} from '../../server/validators';
import {
  generateRoutineWithAI,
  generateChatResponseWithAI,
} from '../../server/aiService';
import { aiResponseCache, Sha256LruCache } from '../../server/cache';
import { VulnerabilityPersona } from '../types/routine';

describe('Server Parameter Validation & Type Guards', () => {
  it('validates allowed urban zones and rejects unknown zones', () => {
    expect(validateZoneId('zone-cbd')).toBe('zone-cbd');
    expect(validateZoneId('zone-industrial')).toBe('zone-industrial');
    expect(() => validateZoneId('invalid-zone-999')).toThrow('Invalid zoneId parameter');
    expect(() => validateZoneId('')).toThrow('Invalid zoneId parameter');
  });

  it('validates allowed vulnerability personas', () => {
    expect(validatePersona(VulnerabilityPersona.AsthmaticChild)).toBe(VulnerabilityPersona.AsthmaticChild);
    expect(validatePersona(VulnerabilityPersona.ElderlyRelative)).toBe(VulnerabilityPersona.ElderlyRelative);
    expect(() => validatePersona('NonExistentPersona')).toThrow('Invalid persona parameter');
  });

  it('validates and sanitizes chat prompt input', () => {
    expect(validatePrompt('How to build a filter?')).toBe('How to build a filter?');
    expect(() => validatePrompt(' ')).toThrow('Prompt parameter must be at least 2 characters');
  });

  it('strips non-printable ASCII control characters (CWE-20 defense)', () => {
    const malicious = 'SafeText\x00\x08\x1bDanger';
    expect(sanitizeText(malicious)).toBe('SafeTextDanger');
  });
});

describe('In-Memory SHA-256 LRU Caching Performance', () => {
  it('computes 16-character SHA-256 hash keys deterministically', () => {
    const key1 = aiResponseCache.hashKey('test-prompt-query');
    const key2 = aiResponseCache.hashKey('test-prompt-query');
    expect(key1).toBe(key2);
    expect(key1.length).toBe(16);
  });

  it('caches entries and enforces sub-millisecond retrieval', () => {
    const customCache = new Sha256LruCache<string>(3, 60000);
    customCache.set('k1', 'val1');
    expect(customCache.get('k1')).toBe('val1');

    const t0 = performance.now();
    for (let i = 0; i < 1000; i++) {
      customCache.get('k1');
    }
    const avgMs = (performance.now() - t0) / 1000;
    expect(avgMs).toBeLessThan(0.01); // < 0.01ms in-memory cache hit
  });

  it('evicts oldest entries when capacity is exceeded', () => {
    const smallCache = new Sha256LruCache<number>(2, 60000);
    smallCache.set('a', 1);
    smallCache.set('b', 2);
    smallCache.set('c', 3); // 'a' evicted

    expect(smallCache.get('a')).toBeNull();
    expect(smallCache.get('b')).toBe(2);
    expect(smallCache.get('c')).toBe(3);
  });
});

describe('GenAI Gateway & Core Intelligence Engine', () => {
  it('generates structured routine insights with hour-by-hour schedule', async () => {
    const result = await generateRoutineWithAI(
      VulnerabilityPersona.AsthmaticChild,
      'zone-cbd'
    );

    expect(result.persona).toBe(VulnerabilityPersona.AsthmaticChild);
    expect(result.zoneId).toBe('zone-cbd');
    expect(result.optimalOutdoorWindow).toBeDefined();
    expect(result.hourByHour.length).toBeGreaterThan(0);
    expect(result.projectedExposureReductionPercent).toBeGreaterThan(50);
  });

  it('generates contextual conversational copilot responses with direct impacts', async () => {
    const res = await generateChatResponseWithAI('What mask to wear?', {
      persona: VulnerabilityPersona.AsthmaticChild,
      zoneId: 'zone-industrial',
      currentAqi: 362,
      isInversionActive: true,
      hasAirPurifier: true,
    });

    expect(res.sender).toBe('assistant');
    expect(res.content.length).toBeGreaterThan(10);
    expect(res.directImpactSummary).toBeDefined();
    expect(res.directImpactSummary?.pm25AvertedMicrograms).toBeGreaterThan(0);
  });
});
