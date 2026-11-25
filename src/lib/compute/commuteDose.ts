// ============================================================
// src/lib/compute/commuteDose.ts
// Inhaled particulate mass intake & multi-modal trade-offs
// ============================================================

import { TransitMode, TransitRouteOption } from '@/types/transit';
import { assertNonNegative, assertPositive } from './asserts';

interface ModeProfile {
  speed: number;
  vent: number;
  filter: number;
  co2PerKm: number;
}

const COMMUTE_MODE_PROFILES: Record<TransitMode, ModeProfile> = {
  [TransitMode.UndergroundMetro]: { speed: 38, vent: 0.6, filter: 0.85, co2PerKm: 0.025 },
  [TransitMode.ElectricBus]: { speed: 20, vent: 0.7, filter: 0.60, co2PerKm: 0.040 },
  [TransitMode.DieselBus]: { speed: 18, vent: 0.8, filter: 0.35, co2PerKm: 0.110 },
  [TransitMode.ElectricVehicle]: { speed: 30, vent: 0.6, filter: 0.90, co2PerKm: 0.045 },
  [TransitMode.GasolineCar]: { speed: 28, vent: 0.6, filter: 0.40, co2PerKm: 0.190 },
  [TransitMode.Cycling]: { speed: 15, vent: 2.2, filter: 0.00, co2PerKm: 0.000 },
  [TransitMode.Walking]: { speed: 4.5, vent: 1.1, filter: 0.00, co2PerKm: 0.000 },
};

function classifyExposureTier(
  dose: number
): { tier: TransitRouteOption['relativeSafetyTier']; note: string } {
  if (dose > 60) {
    return { tier: 'Hazardous', note: 'Severe particulate inhalation risk. Avoid physical exertion.' };
  }
  if (dose > 25) {
    return { tier: 'Caution', note: 'Elevated exposure. Use N95 mask or prefer underground transit.' };
  }
  if (dose > 10) {
    return { tier: 'Acceptable', note: 'Moderate exposure with standard precautions.' };
  }
  return { tier: 'Optimal', note: 'Cleanest route option for respiratory health.' };
}

/**
 * Computes inhaled PM2.5 mass (µg) from ambient concentration, trip duration,
 * respiratory minute ventilation, and cabin/mask filtration efficiency.
 */
export function calculateExposureDose(
  pm25UgM3: number,
  durationHours: number,
  ventilationRateM3h: number,
  filterProtectionFactor = 0.0
): number {
  assertNonNegative(pm25UgM3, 'pm25UgM3');
  assertPositive(durationHours, 'durationHours');
  assertPositive(ventilationRateM3h, 'ventilationRateM3h');
  if (filterProtectionFactor < 0 || filterProtectionFactor > 1) {
    throw new RangeError('filterProtectionFactor must be between 0 (no protection) and 1 (100% HEPA).');
  }

  const effectiveConcentration = pm25UgM3 * (1 - filterProtectionFactor);
  return Math.round(effectiveConcentration * durationHours * ventilationRateM3h * 10) / 10;
}

/**
 * Evaluates commute duration, inhaled PM2.5 dose, CO2 emissions, and clinical safety tier
 * for a given transit mode and corridor length.
 */
export function calculateCommuteMetrics(
  mode: TransitMode,
  distanceKm: number,
  ambientPM25: number
): TransitRouteOption {
  assertPositive(distanceKm, 'distanceKm');
  assertNonNegative(ambientPM25, 'ambientPM25');

  const cfg = COMMUTE_MODE_PROFILES[mode];
  const durationHours = distanceKm / cfg.speed;
  const dose = calculateExposureDose(ambientPM25, durationHours, cfg.vent, cfg.filter);
  const { tier, note } = classifyExposureTier(dose);

  return {
    mode,
    durationMinutes: Math.round(durationHours * 60),
    distanceKm,
    inhaledDosePM25Micrograms: dose,
    co2EmissionsKg: Math.round(cfg.co2PerKm * distanceKm * 100) / 100,
    relativeSafetyTier: tier,
    advisoryNote: note,
  };
}
