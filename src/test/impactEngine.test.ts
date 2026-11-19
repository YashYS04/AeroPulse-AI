// ============================================================
// src/test/impactEngine.test.ts
// Unit tests for Direct Impact Engine & Community Offsets
// ============================================================

import { describe, it, expect } from 'vitest';
import {
  calculateChoiceImpact,
  aggregateDirectImpacts,
  calculateCommunityOffset,
} from '@/lib/compute/impactEngine';
import { INITIAL_COMMUNITY_PLEDGES } from '@/lib/constants/community';

describe('Direct Choice Impact Modeling', () => {
  it('computes Corsi-Rosenthal Box savings and alveolar drop', () => {
    const impact = calculateChoiceImpact('diy-corsi-box', 150);
    expect(impact.alveolarDepositionRiskDropPercent).toBe(88);
    expect(impact.pm25InhaledAvertedUg).toBeGreaterThan(500);
    expect(impact.moneySavedCurrency).toBe(295);
    expect(impact.co2SavedKg).toBe(1.4);
  });

  it('computes Subway vs Diesel Car commute savings', () => {
    const impact = calculateChoiceImpact('subway-vs-diesel', 200);
    expect(impact.alveolarDepositionRiskDropPercent).toBe(75);
    expect(impact.co2SavedKg).toBe(3.2);
    expect(impact.moneySavedCurrency).toBe(12);
  });

  it('computes Inversion-Aware Window Ventilation savings', () => {
    const impact = calculateChoiceImpact('inversion-window-discipline', 180);
    expect(impact.alveolarDepositionRiskDropPercent).toBe(65);
    expect(impact.pm25InhaledAvertedUg).toBeGreaterThan(400);
  });

  it('computes default routine optimization shifts', () => {
    const impact = calculateChoiceImpact('default', 120);
    expect(impact.alveolarDepositionRiskDropPercent).toBe(50);
    expect(impact.co2SavedKg).toBe(1.1);
  });

  it('handles zero ambient pollution safely', () => {
    const impact = calculateChoiceImpact('diy-corsi-box', 0);
    expect(impact.pm25InhaledAvertedUg).toBe(0);
    expect(impact.co2SavedKg).toBeGreaterThan(0);
  });

  it('aggregates multiple lifestyle choices correctly', () => {
    const c1 = calculateChoiceImpact('diy-corsi-box', 100);
    const c2 = calculateChoiceImpact('subway-vs-diesel', 100);
    const summary = aggregateDirectImpacts([c1, c2]);

    expect(summary.activeChoicesCount).toBe(2);
    expect(summary.totalPm25AvertedUg).toBe(c1.pm25InhaledAvertedUg + c2.pm25InhaledAvertedUg);
    expect(summary.totalCo2SavedKg).toBe(Number((c1.co2SavedKg + c2.co2SavedKg).toFixed(1)));
    expect(summary.totalCostSaved).toBe(c1.moneySavedCurrency + c2.moneySavedCurrency);
    expect(summary.respiratoryBurdenReliefPercent).toBe(Math.round((88 + 75) / 2));
  });

  it('handles empty choices array gracefully', () => {
    const summary = aggregateDirectImpacts([]);
    expect(summary.activeChoicesCount).toBe(0);
    expect(summary.totalPm25AvertedUg).toBe(0);
    expect(summary.respiratoryBurdenReliefPercent).toBe(0);
  });
});

describe('Community Offset Computations', () => {
  it('correctly calculates collective CO2 and PM2.5 prevented', () => {
    const offset = calculateCommunityOffset(INITIAL_COMMUNITY_PLEDGES);
    expect(offset.totalCo2AvoidedKg).toBeGreaterThan(1000);
    expect(offset.totalPm25AvoidedGrams).toBeGreaterThan(5000);
  });

  it('increases offset when a user joins an active pledge', () => {
    const initialOffset = calculateCommunityOffset(INITIAL_COMMUNITY_PLEDGES);
    const modifiedPledges = INITIAL_COMMUNITY_PLEDGES.map((p, idx) =>
      idx === 1 ? { ...p, isUserJoined: true } : p
    );
    const newOffset = calculateCommunityOffset(modifiedPledges);
    expect(newOffset.totalCo2AvoidedKg).toBeGreaterThan(initialOffset.totalCo2AvoidedKg);
  });
});
