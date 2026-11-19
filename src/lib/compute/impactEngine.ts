// ============================================================
// src/lib/compute/impactEngine.ts
// Direct Impact Engine: Quantifying physiological, carbon, & cost savings
// ============================================================

import { ChoiceImpactDetail, DirectImpactSummary } from '@/types/impact';
import { CommunityPledge } from '@/types/community';
import { assertNonNegative } from './asserts';

export function calculateChoiceImpact(
  choiceId: string,
  pm25AmbientUg: number
): ChoiceImpactDetail {
  assertNonNegative(pm25AmbientUg, 'pm25AmbientUg');

  switch (choiceId) {
    case 'diy-corsi-box':
      return {
        title: 'DIY Corsi-Rosenthal Box vs Commercial Air Purifier',
        conventionalAction: 'Running $350 commercial HEPA unit or leaving room unpurified',
        sustainableChoice: 'Built $45 DIY 4-MERV13 filter cube delivering 350 m3/h CADR',
        pm25InhaledAvertedUg: Math.round(pm25AmbientUg * 0.88 * 8), // 8 hours indoor
        alveolarDepositionRiskDropPercent: 88,
        co2SavedKg: 1.4, // Lower lifecycle manufacturing emissions
        moneySavedCurrency: 295, // $350 - $55
        clinicalExplanation: 'Reduces PM2.5 particle penetration into bronchial branches and deep pulmonary alveoli by 88%.',
      };
    case 'subway-vs-diesel':
      return {
        title: 'Underground Clean Transit vs Surface Car Commute',
        conventionalAction: 'Single-occupancy gasoline car in highway traffic congestion',
        sustainableChoice: 'Underground rail with HEPA-filtered cabin air intake',
        pm25InhaledAvertedUg: Math.round(pm25AmbientUg * 0.75 * 0.8),
        alveolarDepositionRiskDropPercent: 75,
        co2SavedKg: 3.2,
        moneySavedCurrency: 12,
        clinicalExplanation: 'Underground tunnels isolate commuters from surface thermal smog inversion and black carbon.',
      };
    case 'inversion-window-discipline':
      return {
        title: 'Inversion-Aware Window Ventilation Schedule',
        conventionalAction: 'Opening windows during 7:00 AM nocturnal inversion trap',
        sustainableChoice: 'Sealed windows until 1:30 PM solar convection breaks inversion cap',
        pm25InhaledAvertedUg: Math.round(pm25AmbientUg * 0.65 * 4),
        alveolarDepositionRiskDropPercent: 65,
        co2SavedKg: 0.8,
        moneySavedCurrency: 5,
        clinicalExplanation: 'Prevents 180+ ug/m3 morning particulate plume from settling onto indoor soft furnishings.',
      };
    default:
      return {
        title: 'Low-Emission Routine Optimization',
        conventionalAction: 'Unplanned outdoor activities during peak smog hours',
        sustainableChoice: 'Shifted outdoor errands to afternoon convection clearing window',
        pm25InhaledAvertedUg: Math.round(pm25AmbientUg * 0.50 * 2),
        alveolarDepositionRiskDropPercent: 50,
        co2SavedKg: 1.1,
        moneySavedCurrency: 8,
        clinicalExplanation: 'Minimizes peak minute respiratory ventilation during highest atmospheric concentration.',
      };
  }
}

export function aggregateDirectImpacts(
  choices: ChoiceImpactDetail[]
): DirectImpactSummary {
  let totalPm25 = 0;
  let totalCo2 = 0;
  let totalCost = 0;
  let totalRiskDrop = 0;

  for (const c of choices) {
    totalPm25 += c.pm25InhaledAvertedUg;
    totalCo2 += c.co2SavedKg;
    totalCost += c.moneySavedCurrency;
    totalRiskDrop += c.alveolarDepositionRiskDropPercent;
  }

  const avgRiskDrop = choices.length > 0 ? Math.round(totalRiskDrop / choices.length) : 0;

  return {
    totalPm25AvertedUg: Math.round(totalPm25),
    totalCo2SavedKg: Math.round(totalCo2 * 10) / 10,
    totalCostSaved: Math.round(totalCost),
    respiratoryBurdenReliefPercent: avgRiskDrop,
    activeChoicesCount: choices.length,
  };
}

export function calculateCommunityOffset(
  pledges: CommunityPledge[]
): { totalCo2AvoidedKg: number; totalPm25AvoidedGrams: number } {
  let co2 = 0;
  let pm25 = 0;

  for (const p of pledges) {
    const participants = p.activePledgersCount + (p.isUserJoined ? 1 : 0);
    co2 += p.dailyCo2AvoidedKg * participants;
    pm25 += p.dailyPm25AvoidedGrams * participants;
  }

  return {
    totalCo2AvoidedKg: Math.round(co2 * 10) / 10,
    totalPm25AvoidedGrams: Math.round(pm25 * 10) / 10,
  };
}
