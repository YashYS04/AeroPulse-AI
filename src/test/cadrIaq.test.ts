// ============================================================
// src/test/cadrIaq.test.ts
// Unit tests for Room CADR, single-compartment decay & ACH
// ============================================================

import { describe, it, expect } from 'vitest';
import {
  calculateRoomVolume,
  calculateRequiredCADR,
  estimatePurificationTime,
  computeRoomCADRProfile,
} from '@/lib/compute/cadrCalculations';

describe('Room CADR & ACH Calculations', () => {
  it('accurately calculates room air volume in cubic meters', () => {
    // 5m x 4m x 3m = 60 m3
    expect(calculateRoomVolume(5, 4, 3)).toBe(60);
    // 6.5m x 4.2m x 2.8m = 76.44 m3
    expect(calculateRoomVolume(6.5, 4.2, 2.8)).toBe(76.44);
  });

  it('throws RangeError on non-positive room dimensions', () => {
    expect(() => calculateRoomVolume(0, 4, 3)).toThrow(RangeError);
    expect(() => calculateRoomVolume(5, -2, 3)).toThrow(RangeError);
    expect(() => calculateRoomVolume(5, 4, -1)).toThrow(RangeError);
  });

  it('computes required CADR based on target ACH', () => {
    // 60 m3 * 4 ACH = 240 m3/h
    expect(calculateRequiredCADR(60, 4)).toBe(240);
    // 80 m3 * 5 ACH = 400 m3/h
    expect(calculateRequiredCADR(80, 5)).toBe(400);
  });

  it('estimates 90% particle clearance time using exponential decay', () => {
    // V = 60 m3, CADR = 350 m3/h, 90% clearance (-ln(0.1) ~ 2.302)
    // t = 2.302 * (60 / 350) * 60 = ~23.68 -> 24 mins
    const time = estimatePurificationTime(60, 350, 0.90);
    expect(time).toBe(24);
  });

  it('throws RangeError when target clearance fraction is outside (0, 1)', () => {
    expect(() => estimatePurificationTime(60, 350, 0)).toThrow(RangeError);
    expect(() => estimatePurificationTime(60, 350, 1.0)).toThrow(RangeError);
    expect(() => estimatePurificationTime(60, 350, -0.5)).toThrow(RangeError);
  });

  it('computes unified room CADR profile accurately', () => {
    const profile = computeRoomCADRProfile(5, 4, 3, 4, 380);
    expect(profile.roomVolumeM3).toBe(60);
    expect(profile.requiredCADRm3h).toBe(240);
    expect(profile.clearanceTimeMinutes).toBeGreaterThan(0);
    expect(profile.recommendedUnitsCount).toBe(1);
  });
});
