// ============================================================
// src/lib/compute/aqiBreakpoints.ts
// EPA AQI Category mapping, high-contrast colors & sub-index
// ============================================================

import { AQICategory } from '@/types/telemetry';
import { assertNonNegative, linearInterpolation } from './asserts';

interface AqiBand {
  maxAqi: number;
  category: AQICategory;
  color: string;
}

type BreakpointRow = readonly [cLow: number, cHigh: number, iLow: number, iHigh: number];

const AQI_BANDS: readonly AqiBand[] = [
  { maxAqi: 50, category: AQICategory.Good, color: '#10b981' },
  { maxAqi: 100, category: AQICategory.Moderate, color: '#f59e0b' },
  { maxAqi: 150, category: AQICategory.UnhealthySensitive, color: '#f97316' },
  { maxAqi: 200, category: AQICategory.Unhealthy, color: '#ef4444' },
  { maxAqi: 300, category: AQICategory.VeryUnhealthy, color: '#a855f7' },
  { maxAqi: Infinity, category: AQICategory.Hazardous, color: '#881337' },
];

const PM25_BREAKPOINTS: readonly BreakpointRow[] = [
  [0.0, 12.0, 0, 50],
  [12.1, 35.4, 51, 100],
  [35.5, 55.4, 101, 150],
  [55.5, 150.4, 151, 200],
  [150.5, 250.4, 201, 300],
  [250.5, 350.4, 301, 400],
  [350.5, 500.4, 401, 500],
];

const PM10_BREAKPOINTS: readonly BreakpointRow[] = [
  [0, 54, 0, 50],
  [55, 154, 51, 100],
  [155, 254, 101, 150],
  [255, 354, 151, 200],
  [355, 424, 201, 300],
];

function findAqiBand(aqi: number): AqiBand {
  assertNonNegative(aqi, 'aqi');
  return AQI_BANDS.find((band) => aqi <= band.maxAqi) ?? AQI_BANDS[AQI_BANDS.length - 1];
}

function interpolateSubIndex(concentration: number, table: readonly BreakpointRow[]): number {
  for (const [cLow, cHigh, iLow, iHigh] of table) {
    if (concentration <= cHigh) {
      return linearInterpolation(concentration, cLow, cHigh, iLow, iHigh);
    }
  }
  return 500;
}

/** Maps a numeric US-EPA AQI value to its clinical risk category. */
export function calculateAQICategory(aqi: number): AQICategory {
  return findAqiBand(aqi).category;
}

/** Returns the high-contrast semantic hex color associated with a US-EPA AQI value. */
export function getAQIColor(aqi: number): string {
  return findAqiBand(aqi).color;
}

/** Computes the US-EPA AQI sub-index for a 24-hour PM2.5 concentration (µg/m³). */
export function calculatePM25SubIndex(pm25: number): number {
  assertNonNegative(pm25, 'pm25');
  return interpolateSubIndex(Math.round(pm25 * 10) / 10, PM25_BREAKPOINTS);
}

/** Computes the US-EPA AQI sub-index for a 24-hour PM10 concentration (µg/m³). */
export function calculatePM10SubIndex(pm10: number): number {
  assertNonNegative(pm10, 'pm10');
  return interpolateSubIndex(Math.round(pm10), PM10_BREAKPOINTS);
}
