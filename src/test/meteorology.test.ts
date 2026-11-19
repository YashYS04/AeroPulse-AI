// ============================================================
// src/test/meteorology.test.ts
// Unit tests for atmospheric boundary layer inversion modeling
// ============================================================

import { describe, it, expect } from 'vitest';
import { evaluateInversionRisk } from '@/lib/compute/meteorology';

describe('Boundary Layer Inversion & Meteorology Engine', () => {
  it('detects severe inversion when cap is much warmer than ground with stagnant wind', () => {
    // T_ground: 10C, T_cap: 16C, wind: 3 km/h -> Severe
    const status = evaluateInversionRisk(10.0, 16.0, 3.0);
    expect(status.isInversionActive).toBe(true);
    expect(status.severity).toBe('Severe');
    expect(status.lapseRateDelta).toBe(6.0);
    expect(status.stagnationIndex).toBeGreaterThanOrEqual(0.9);
    expect(status.clearingHourExpected).toBe(13); // 1:00 PM
  });

  it('detects moderate inversion under mild positive lapse rate', () => {
    // T_ground: 12C, T_cap: 13.5C, wind: 8 km/h -> Moderate
    const status = evaluateInversionRisk(12.0, 13.5, 8.0);
    expect(status.isInversionActive).toBe(true);
    expect(status.severity).toBe('Moderate');
    expect(status.lapseRateDelta).toBe(1.5);
    expect(status.clearingHourExpected).toBe(11);
  });

  it('reports normal mixing when ground is warmer than cap (negative lapse rate)', () => {
    // T_ground: 18C, T_cap: 14C, wind: 12 km/h -> Normal
    const status = evaluateInversionRisk(18.0, 14.0, 12.0);
    expect(status.isInversionActive).toBe(false);
    expect(status.severity).toBe('None');
    expect(status.lapseRateDelta).toBe(-4.0);
  });

  it('throws on non-finite temperatures or negative wind speeds', () => {
    expect(() => evaluateInversionRisk(NaN, 15, 5)).toThrow(TypeError);
    expect(() => evaluateInversionRisk(10, Infinity, 5)).toThrow(TypeError);
    expect(() => evaluateInversionRisk(10, 15, -2)).toThrow(RangeError);
  });
});
