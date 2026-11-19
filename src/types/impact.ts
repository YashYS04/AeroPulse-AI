// ============================================================
// src/types/impact.ts
// Direct Impact Engine structures: health, emissions, & cost
// ============================================================

export interface ChoiceImpactDetail {
  title: string;
  conventionalAction: string;
  sustainableChoice: string;
  pm25InhaledAvertedUg: number;
  alveolarDepositionRiskDropPercent: number;
  co2SavedKg: number;
  moneySavedCurrency: number; // In local currency unit
  clinicalExplanation: string;
}

export interface DirectImpactSummary {
  totalPm25AvertedUg: number;
  totalCo2SavedKg: number;
  totalCostSaved: number;
  respiratoryBurdenReliefPercent: number;
  activeChoicesCount: number;
}
