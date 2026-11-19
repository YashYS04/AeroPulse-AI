// ============================================================
// src/lib/compute/asserts.ts
// Mathematical assertions and linear interpolation helpers
// ============================================================

export function assertFiniteNumber(value: number, paramName: string): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || Number.isNaN(value)) {
    throw new TypeError(`Parameter "${paramName}" must be a finite number. Received: ${value}`);
  }
}

export function assertPositive(value: number, paramName: string): void {
  assertFiniteNumber(value, paramName);
  if (value <= 0) {
    throw new RangeError(`Parameter "${paramName}" must be positive (> 0). Received: ${value}`);
  }
}

export function assertNonNegative(value: number, paramName: string): void {
  assertFiniteNumber(value, paramName);
  if (value < 0) {
    throw new RangeError(`Parameter "${paramName}" cannot be negative (< 0). Received: ${value}`);
  }
}

export function linearInterpolation(
  c: number,
  cLow: number,
  cHigh: number,
  iLow: number,
  iHigh: number
): number {
  if (cHigh === cLow) return iLow;
  const slope = (iHigh - iLow) / (cHigh - cLow);
  return Math.round(slope * (c - cLow) + iLow);
}
