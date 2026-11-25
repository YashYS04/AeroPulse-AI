// ============================================================
// src/lib/compute/meteorology.ts
// Boundary layer temperature lapse rates & inversion modeling
// ============================================================

import { InversionStatus } from '@/types/telemetry';
import { assertFiniteNumber, assertNonNegative } from './asserts';

/** Evaluates ground-level thermal inversion risk from temperature lapse rate and wind speed. */
export function evaluateInversionRisk(
  temperatureGround: number,
  temperatureCap: number,
  windSpeedKmh: number
): InversionStatus {
  assertFiniteNumber(temperatureGround, 'temperatureGround');
  assertFiniteNumber(temperatureCap, 'temperatureCap');
  assertNonNegative(windSpeedKmh, 'windSpeedKmh');

  const lapseRateDelta = Math.round((temperatureCap - temperatureGround) * 10) / 10;
  const isStagnant = windSpeedKmh < 6.0;

  if (lapseRateDelta > 2.0 && isStagnant) {
    return {
      isInversionActive: true,
      severity: 'Severe',
      lapseRateDelta,
      stagnationIndex: 0.95,
      clearingHourExpected: 13, // 1:00 PM solar convection
      advisoryText: 'Critical thermal boundary inversion. Toxic soot trapped at breathing level.',
    };
  }

  if (lapseRateDelta > 0.0) {
    return {
      isInversionActive: true,
      severity: 'Moderate',
      lapseRateDelta,
      stagnationIndex: 0.65,
      clearingHourExpected: 11, // 11:00 AM
      advisoryText: 'Mild thermal inversion cap present. Ground-level ventilation is suppressed.',
    };
  }

  return {
    isInversionActive: false,
    severity: 'None',
    lapseRateDelta,
    stagnationIndex: 0.15,
    clearingHourExpected: 8,
    advisoryText: 'Normal vertical atmospheric mixing active. No inversion cap detected.',
  };
}
