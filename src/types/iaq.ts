// ============================================================
// src/types/iaq.ts
// Indoor Air Quality, CADR calculations, and DIY hacks
// ============================================================

export interface DIYAirHack {
  id: string;
  title: string;
  estimatedCostUsd: number;
  deliveryCADRm3h: number; // Clean Air Delivery Rate
  efficiencyRating: string;
  buildTimeMinutes: number;
  description: string;
  materialsNeeded: string[];
  stepByStepGuide: string[];
}

export interface RoomCADRResult {
  roomVolumeM3: number;
  targetACH: number; // Air Changes per Hour (e.g. 4-5)
  requiredCADRm3h: number;
  clearanceTimeMinutes: number;
  recommendedUnitsCount: number;
}

export interface WindowScheduleSlot {
  timeWindow: string; // e.g. "06:00 - 10:00"
  status: 'Strictly Closed' | 'Cautionary Brief' | 'Safe Full Flush';
  ambientSmogRisk: 'Extreme' | 'High' | 'Low';
  rationale: string;
}
