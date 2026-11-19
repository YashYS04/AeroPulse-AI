// ============================================================
// src/test/commuteRouting.test.ts
// Unit tests for commute dose, transit trade-offs & Dijkstra
// ============================================================

import { describe, it, expect } from 'vitest';
import {
  calculateExposureDose,
  calculateCommuteMetrics,
} from '@/lib/compute/commuteDose';
import { dijkstraLowestExposure } from '@/lib/compute/dijkstraRouter';
import { TransitMode, TransitEdge } from '@/types/transit';
import { TRANSIT_NODES, TRANSIT_EDGES } from '@/lib/constants/transit';

describe('Inhaled Particulate Dose Mathematics', () => {
  it('calculates inhaled PM2.5 dose accurately', () => {
    // 100 ug/m3 * 0.5 hours * 1.0 m3/h * (1 - 0) = 50 ug
    expect(calculateExposureDose(100, 0.5, 1.0, 0.0)).toBe(50);
    // With 80% filtration (1 - 0.80 = 0.20): 100 * 0.5 * 1.0 * 0.2 = 10 ug
    expect(calculateExposureDose(100, 0.5, 1.0, 0.80)).toBe(10);
  });

  it('throws on invalid filter protection factor', () => {
    expect(() => calculateExposureDose(100, 1, 1, -0.1)).toThrow(RangeError);
    expect(() => calculateExposureDose(100, 1, 1, 1.5)).toThrow(RangeError);
  });

  it('evaluates all 7 multi-modal transit trade-offs correctly', () => {
    const modes = [
      TransitMode.UndergroundMetro,
      TransitMode.ElectricBus,
      TransitMode.DieselBus,
      TransitMode.ElectricVehicle,
      TransitMode.GasolineCar,
      TransitMode.Cycling,
      TransitMode.Walking,
    ];

    modes.forEach((mode) => {
      const metric = calculateCommuteMetrics(mode, 10, 120);
      expect(metric.mode).toBe(mode);
      expect(metric.durationMinutes).toBeGreaterThan(0);
      expect(metric.inhaledDosePM25Micrograms).toBeGreaterThanOrEqual(0);
      expect(metric.co2EmissionsKg).toBeGreaterThanOrEqual(0);
    });

    const metro = calculateCommuteMetrics(TransitMode.UndergroundMetro, 10, 150);
    const cycling = calculateCommuteMetrics(TransitMode.Cycling, 10, 150);
    expect(metro.inhaledDosePM25Micrograms).toBeLessThan(cycling.inhaledDosePM25Micrograms);
    expect(metro.relativeSafetyTier).toBe('Optimal');
    expect(cycling.relativeSafetyTier).toBe('Hazardous');
  });
});

describe('Dijkstra Lowest-Exposure Pathfinding', () => {
  it('prefers subterranean clean corridor over surface diesel routes', () => {
    const result = dijkstraLowestExposure(
      TRANSIT_NODES,
      TRANSIT_EDGES,
      'node-cbd',
      'node-south-hills',
      2.5 // High smog multiplier
    );

    expect(result).not.toBeNull();
    if (result) {
      expect(result.pathNodeIds).toContain('node-metro-hub');
      expect(result.usedModes).toContain(TransitMode.UndergroundMetro);
      expect(result.totalDistanceKm).toBeGreaterThan(0);
    }
  });

  it('handles identity path when start equals destination', () => {
    const result = dijkstraLowestExposure(
      TRANSIT_NODES,
      TRANSIT_EDGES,
      'node-cbd',
      'node-cbd'
    );
    expect(result).toEqual({
      pathNodeIds: ['node-cbd'],
      totalDistanceKm: 0,
      cumulativeExposureScore: 0,
      usedModes: [],
    });
  });

  it('returns null when path does not exist in disconnected graph', () => {
    const isolatedNodes = [
      { id: 'node-a', name: 'A', sector: 'A', baselineExposureRate: 1 },
      { id: 'node-b', name: 'B', sector: 'B', baselineExposureRate: 1 },
    ];
    const isolatedEdges: TransitEdge[] = [];
    const result = dijkstraLowestExposure(isolatedNodes, isolatedEdges, 'node-a', 'node-b');
    expect(result).toBeNull();
  });
});
