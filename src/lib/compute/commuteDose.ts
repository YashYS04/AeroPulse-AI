// ============================================================
// src/lib/compute/commuteDose.ts
// Inhaled particulate mass intake & multi-modal trade-offs
// ============================================================

import { TransitMode, TransitRouteOption } from '@/types/transit';
import { assertNonNegative, assertPositive } from './asserts';

export function calculateExposureDose(
  pm25UgM3: number,
  durationHours: number,
  ventilationRateM3h: number,
  filterProtectionFactor: number = 0.0
): number {
  assertNonNegative(pm25UgM3, 'pm25UgM3');
  assertPositive(durationHours, 'durationHours');
  assertPositive(ventilationRateM3h, 'ventilationRateM3h');
  if (filterProtectionFactor < 0 || filterProtectionFactor > 1) {
    throw new RangeError('filterProtectionFactor must be between 0 (no protection) and 1 (100% HEPA).');
  }

  const effectiveConcentration = pm25UgM3 * (1 - filterProtectionFactor);
  const totalVolumeInhaled = durationHours * ventilationRateM3h;
  return Math.round(effectiveConcentration * totalVolumeInhaled * 10) / 10;
}

export function calculateCommuteMetrics(
  mode: TransitMode,
  distanceKm: number,
  ambientPM25: number
): TransitRouteOption {
  assertPositive(distanceKm, 'distanceKm');
  assertNonNegative(ambientPM25, 'ambientPM25');

  const configs: Record<TransitMode, { speed: number; vent: number; filter: number; co2PerKm: number }> = {
    [TransitMode.UndergroundMetro]: { speed: 38, vent: 0.6, filter: 0.85, co2PerKm: 0.025 },
    [TransitMode.ElectricBus]: { speed: 20, vent: 0.7, filter: 0.60, co2PerKm: 0.040 },
    [TransitMode.DieselBus]: { speed: 18, vent: 0.8, filter: 0.35, co2PerKm: 0.110 },
    [TransitMode.ElectricVehicle]: { speed: 30, vent: 0.6, filter: 0.90, co2PerKm: 0.045 },
    [TransitMode.GasolineCar]: { speed: 28, vent: 0.6, filter: 0.40, co2PerKm: 0.190 },
    [TransitMode.Cycling]: { speed: 15, vent: 2.2, filter: 0.00, co2PerKm: 0.000 },
    [TransitMode.Walking]: { speed: 4.5, vent: 1.1, filter: 0.00, co2PerKm: 0.000 },
  };

  const cfg = configs[mode];
  const durationHours = distanceKm / cfg.speed;
  const durationMinutes = Math.round(durationHours * 60);
  const dose = calculateExposureDose(ambientPM25, durationHours, cfg.vent, cfg.filter);
  const co2EmissionsKg = Math.round(cfg.co2PerKm * distanceKm * 100) / 100;

  let tier: TransitRouteOption['relativeSafetyTier'] = 'Optimal';
  let note = 'Cleanest route option for respiratory health.';
  if (dose > 60) {
    tier = 'Hazardous';
    note = 'Severe particulate inhalation risk. Avoid physical exertion.';
  } else if (dose > 25) {
    tier = 'Caution';
    note = 'Elevated exposure. Use N95 mask or prefer underground transit.';
  } else if (dose > 10) {
    tier = 'Acceptable';
    note = 'Moderate exposure with standard precautions.';
  }

  return {
    mode,
    durationMinutes,
    distanceKm,
    inhaledDosePM25Micrograms: dose,
    co2EmissionsKg,
    relativeSafetyTier: tier,
    advisoryNote: note,
  };
}
