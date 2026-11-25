// ============================================================
// src/lib/compute/cadrCalculations.ts
// Single-compartment mass balance & ASHRAE CADR equations
// ============================================================

import { RoomCADRResult } from '@/types/iaq';
import { assertPositive } from './asserts';

/** Calculates indoor room air volume in cubic meters. */
export function calculateRoomVolume(
  lengthMeters: number,
  widthMeters: number,
  heightMeters: number
): number {
  assertPositive(lengthMeters, 'lengthMeters');
  assertPositive(widthMeters, 'widthMeters');
  assertPositive(heightMeters, 'heightMeters');
  return Math.round(lengthMeters * widthMeters * heightMeters * 100) / 100;
}

export function calculateRequiredCADR(
  volumeM3: number,
  targetACH: number = 4
): number {
  assertPositive(volumeM3, 'volumeM3');
  assertPositive(targetACH, 'targetACH');
  return Math.round(volumeM3 * targetACH);
}

export function estimatePurificationTime(
  volumeM3: number,
  cadrM3h: number,
  targetFraction: number = 0.90
): number {
  assertPositive(volumeM3, 'volumeM3');
  assertPositive(cadrM3h, 'cadrM3h');
  if (targetFraction <= 0 || targetFraction >= 1) {
    throw new RangeError('targetFraction must be strictly between 0 and 1 (e.g. 0.90 for 90% reduction).');
  }

  // First-order exponential decay formula: t = (-ln(1 - fraction) * V / CADR) * 60 minutes
  const decayConstant = -Math.log(1 - targetFraction);
  const minutes = (decayConstant * (volumeM3 / cadrM3h)) * 60;
  return Math.round(minutes);
}

export function computeRoomCADRProfile(
  lengthM: number,
  widthM: number,
  heightM: number,
  targetACH: number = 4,
  unitDeliveryCadr: number = 350
): RoomCADRResult {
  const roomVolumeM3 = calculateRoomVolume(lengthM, widthM, heightM);
  const requiredCADRm3h = calculateRequiredCADR(roomVolumeM3, targetACH);
  const clearanceTimeMinutes = estimatePurificationTime(roomVolumeM3, unitDeliveryCadr, 0.90);
  const recommendedUnitsCount = Math.max(1, Math.ceil(requiredCADRm3h / unitDeliveryCadr));

  return {
    roomVolumeM3,
    targetACH,
    requiredCADRm3h,
    clearanceTimeMinutes,
    recommendedUnitsCount,
  };
}
