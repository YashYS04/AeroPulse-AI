// ============================================================
// src/lib/compute/impactEngine.ts
// Direct Impact Engine: Quantifying physiological, carbon, & cost savings
// ============================================================

import { ChoiceImpactDetail, DirectImpactSummary } from '@/types/impact';
import { CommunityPledge } from '@/types/community';
import { assertNonNegative } from './asserts';

interface ChoiceTemplate {
  title: string;
  conventionalAction: string;
  sustainableChoice: string;
  exposureFactor: number;
  alveolarDepositionRiskDropPercent: number;
  co2SavedKg: number;
  moneySavedCurrency: number;
  clinicalExplanation: string;
}

const CHOICE_TEMPLATES: Record<string, ChoiceTemplate> = {
  'diy-corsi-box': {
    title: 'DIY Corsi-Rosenthal Box vs Commercial Air Purifier',
    conventionalAction: 'Running $350 commercial HEPA unit or leaving room unpurified',
    sustainableChoice: 'Built $45 DIY 4-MERV13 filter cube delivering 350 m3/h CADR',
    exposureFactor: 0.88 * 8,
    alveolarDepositionRiskDropPercent: 88,
    co2SavedKg: 1.4,
    moneySavedCurrency: 295,
    clinicalExplanation: 'Reduces PM2.5 particle penetration into bronchial branches and deep pulmonary alveoli by 88%.',
  },
  'subway-vs-diesel': {
    title: 'Underground Clean Transit vs Surface Car Commute',
    conventionalAction: 'Single-occupancy gasoline car in highway traffic congestion',
    sustainableChoice: 'Underground rail with HEPA-filtered cabin air intake',
    exposureFactor: 0.75 * 0.8,
    alveolarDepositionRiskDropPercent: 75,
    co2SavedKg: 3.2,
    moneySavedCurrency: 12,
    clinicalExplanation: 'Underground tunnels isolate commuters from surface thermal smog inversion and black carbon.',
  },
  'inversion-window-discipline': {
    title: 'Inversion-Aware Window Ventilation Schedule',
    conventionalAction: 'Opening windows during 7:00 AM nocturnal inversion trap',
    sustainableChoice: 'Sealed windows until 1:30 PM solar convection breaks inversion cap',
    exposureFactor: 0.65 * 4,
    alveolarDepositionRiskDropPercent: 65,
    co2SavedKg: 0.8,
    moneySavedCurrency: 5,
    clinicalExplanation: 'Prevents 180+ ug/m3 morning particulate plume from settling onto indoor soft furnishings.',
  },
  default: {
    title: 'Low-Emission Routine Optimization',
    conventionalAction: 'Unplanned outdoor activities during peak smog hours',
    sustainableChoice: 'Shifted outdoor errands to afternoon convection clearing window',
    exposureFactor: 0.50 * 2,
    alveolarDepositionRiskDropPercent: 50,
    co2SavedKg: 1.1,
    moneySavedCurrency: 8,
    clinicalExplanation: 'Minimizes peak minute respiratory ventilation during highest atmospheric concentration.',
  },
};

/**
 * Computes direct PM2.5 avoidance, alveolar risk drop, CO2 savings, and cost impact
 * for a given sustainable lifestyle choice under ambient PM2.5 conditions.
 */
export function calculateChoiceImpact(
  choiceId: string,
  pm25AmbientUg: number
): ChoiceImpactDetail {
  assertNonNegative(pm25AmbientUg, 'pm25AmbientUg');
  const template = CHOICE_TEMPLATES[choiceId] ?? CHOICE_TEMPLATES.default;

  return {
    title: template.title,
    conventionalAction: template.conventionalAction,
    sustainableChoice: template.sustainableChoice,
    pm25InhaledAvertedUg: Math.round(pm25AmbientUg * template.exposureFactor),
    alveolarDepositionRiskDropPercent: template.alveolarDepositionRiskDropPercent,
    co2SavedKg: template.co2SavedKg,
    moneySavedCurrency: template.moneySavedCurrency,
    clinicalExplanation: template.clinicalExplanation,
  };
}

/**
 * Aggregates cumulative PM2.5 averted, CO2 saved, cost savings, and average respiratory relief
 * across all adopted user choices.
 */
export function aggregateDirectImpacts(
  choices: ChoiceImpactDetail[]
): DirectImpactSummary {
  const totals = choices.reduce(
    (acc, c) => ({
      pm25: acc.pm25 + c.pm25InhaledAvertedUg,
      co2: acc.co2 + c.co2SavedKg,
      cost: acc.cost + c.moneySavedCurrency,
      riskDrop: acc.riskDrop + c.alveolarDepositionRiskDropPercent,
    }),
    { pm25: 0, co2: 0, cost: 0, riskDrop: 0 }
  );

  const avgRiskDrop = choices.length > 0 ? Math.round(totals.riskDrop / choices.length) : 0;

  return {
    totalPm25AvertedUg: Math.round(totals.pm25),
    totalCo2SavedKg: Math.round(totals.co2 * 10) / 10,
    totalCostSaved: Math.round(totals.cost),
    respiratoryBurdenReliefPercent: avgRiskDrop,
    activeChoicesCount: choices.length,
  };
}

/**
 * Sums daily community CO2 and PM2.5 offsets across active neighborhood pledges.
 */
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
