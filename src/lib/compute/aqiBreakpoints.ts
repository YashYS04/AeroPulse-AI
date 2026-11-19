// ============================================================
// src/lib/compute/aqiBreakpoints.ts
// EPA AQI Category mapping, high-contrast colors & sub-index
// ============================================================

import { AQICategory } from '@/types/telemetry';
import { assertNonNegative, linearInterpolation } from './asserts';

export function calculateAQICategory(aqi: number): AQICategory {
  assertNonNegative(aqi, 'aqi');
  if (aqi <= 50) return AQICategory.Good;
  if (aqi <= 100) return AQICategory.Moderate;
  if (aqi <= 150) return AQICategory.UnhealthySensitive;
  if (aqi <= 200) return AQICategory.Unhealthy;
  if (aqi <= 300) return AQICategory.VeryUnhealthy;
  return AQICategory.Hazardous;
}

export function getAQIColor(aqi: number): string {
  assertNonNegative(aqi, 'aqi');
  if (aqi <= 50) return '#10b981'; // Emerald 500
  if (aqi <= 100) return '#f59e0b'; // Amber 500
  if (aqi <= 150) return '#f97316'; // Orange 500
  if (aqi <= 200) return '#ef4444'; // Red 500
  if (aqi <= 300) return '#a855f7'; // Purple 500
  return '#881337'; // Deep Maroon
}

export function calculatePM25SubIndex(pm25: number): number {
  assertNonNegative(pm25, 'pm25');
  const c = Math.round(pm25 * 10) / 10;
  if (c <= 12.0) return linearInterpolation(c, 0.0, 12.0, 0, 50);
  if (c <= 35.4) return linearInterpolation(c, 12.1, 35.4, 51, 100);
  if (c <= 55.4) return linearInterpolation(c, 35.5, 55.4, 101, 150);
  if (c <= 150.4) return linearInterpolation(c, 55.5, 150.4, 151, 200);
  if (c <= 250.4) return linearInterpolation(c, 150.5, 250.4, 201, 300);
  if (c <= 350.4) return linearInterpolation(c, 250.5, 350.4, 301, 400);
  if (c <= 500.4) return linearInterpolation(c, 350.5, 500.4, 401, 500);
  return 500;
}

export function calculatePM10SubIndex(pm10: number): number {
  assertNonNegative(pm10, 'pm10');
  const c = Math.round(pm10);
  if (c <= 54) return linearInterpolation(c, 0, 54, 0, 50);
  if (c <= 154) return linearInterpolation(c, 55, 154, 51, 100);
  if (c <= 254) return linearInterpolation(c, 155, 254, 101, 150);
  if (c <= 354) return linearInterpolation(c, 255, 354, 151, 200);
  if (c <= 424) return linearInterpolation(c, 355, 424, 201, 300);
  return 500;
}
