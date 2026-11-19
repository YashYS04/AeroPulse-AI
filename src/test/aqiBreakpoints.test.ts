// ============================================================
// src/test/aqiBreakpoints.test.ts
// Mathematical unit tests for EPA breakpoints & AQI sub-indexes
// ============================================================

import { describe, it, expect } from 'vitest';
import {
  calculateAQICategory,
  getAQIColor,
  calculatePM25SubIndex,
  calculatePM10SubIndex,
} from '@/lib/compute/aqiBreakpoints';
import { AQICategory } from '@/types/telemetry';

describe('AQI Category Classification', () => {
  it('correctly maps all 6 EPA AQI tiers', () => {
    expect(calculateAQICategory(25)).toBe(AQICategory.Good);
    expect(calculateAQICategory(50)).toBe(AQICategory.Good);
    expect(calculateAQICategory(75)).toBe(AQICategory.Moderate);
    expect(calculateAQICategory(100)).toBe(AQICategory.Moderate);
    expect(calculateAQICategory(125)).toBe(AQICategory.UnhealthySensitive);
    expect(calculateAQICategory(150)).toBe(AQICategory.UnhealthySensitive);
    expect(calculateAQICategory(175)).toBe(AQICategory.Unhealthy);
    expect(calculateAQICategory(200)).toBe(AQICategory.Unhealthy);
    expect(calculateAQICategory(250)).toBe(AQICategory.VeryUnhealthy);
    expect(calculateAQICategory(300)).toBe(AQICategory.VeryUnhealthy);
    expect(calculateAQICategory(350)).toBe(AQICategory.Hazardous);
    expect(calculateAQICategory(500)).toBe(AQICategory.Hazardous);
  });

  it('throws RangeError on negative AQI', () => {
    expect(() => calculateAQICategory(-5)).toThrow(RangeError);
  });

  it('throws TypeError on non-finite values', () => {
    expect(() => calculateAQICategory(NaN)).toThrow(TypeError);
    expect(() => calculateAQICategory(Infinity)).toThrow(TypeError);
  });
});

describe('Standardized AQI Design Token Colors', () => {
  it('returns appropriate hex tokens across tiers', () => {
    expect(getAQIColor(30)).toBe('#10b981'); // Emerald
    expect(getAQIColor(80)).toBe('#f59e0b'); // Amber
    expect(getAQIColor(130)).toBe('#f97316'); // Orange
    expect(getAQIColor(180)).toBe('#ef4444'); // Red
    expect(getAQIColor(250)).toBe('#a855f7'); // Purple
    expect(getAQIColor(400)).toBe('#881337'); // Maroon
  });
});

describe('EPA PM2.5 Piecewise Linear Sub-Index', () => {
  it('interpolates accurately across all breakpoint ranges', () => {
    expect(calculatePM25SubIndex(0)).toBe(0);
    expect(calculatePM25SubIndex(12.0)).toBe(50);
    expect(calculatePM25SubIndex(35.4)).toBe(100);
    expect(calculatePM25SubIndex(55.4)).toBe(150);
    expect(calculatePM25SubIndex(150.4)).toBe(200);
    expect(calculatePM25SubIndex(250.4)).toBe(300);
    expect(calculatePM25SubIndex(350.4)).toBe(400);
    expect(calculatePM25SubIndex(500.4)).toBe(500);
  });

  it('caps at 500 when concentration exceeds 500.4 ug/m3', () => {
    expect(calculatePM25SubIndex(600)).toBe(500);
  });

  it('throws on negative PM2.5 concentration', () => {
    expect(() => calculatePM25SubIndex(-1.5)).toThrow(RangeError);
  });
});

describe('EPA PM10 Sub-Index', () => {
  it('interpolates PM10 values correctly', () => {
    expect(calculatePM10SubIndex(0)).toBe(0);
    expect(calculatePM10SubIndex(54)).toBe(50);
    expect(calculatePM10SubIndex(154)).toBe(100);
    expect(calculatePM10SubIndex(254)).toBe(150);
  });
});
