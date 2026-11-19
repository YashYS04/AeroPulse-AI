// ============================================================
// src/types/routine.ts
// Persona, daily schedule, and GenAI recommendations
// ============================================================

export enum VulnerabilityPersona {
  AsthmaticChild = 'Asthmatic Child',
  NewbornInfant = 'Newborn Infant',
  ElderlyRelative = 'Elderly Relative (65+)',
  SchoolRunParent = 'School-Run Parent',
  UrbanCommuter = 'Daily Urban Commuter',
  CommunityCoordinator = 'Community Coordinator',
}

export interface RoutineHour {
  hour: number; // 0-23
  label: string; // e.g. "08:00 AM"
  predictedAqi: number;
  activityRecommendation: string;
  isSafeOutdoorWindow: boolean;
  maskRequired: boolean;
  purifierSetting: 'Off' | 'Eco' | 'High' | 'Turbo';
}

export interface RoutineInsight {
  persona: VulnerabilityPersona;
  zoneId: string;
  generatedAt: string;
  optimalOutdoorWindow: string;
  hourByHour: RoutineHour[];
  clinicalRationale: string;
  sustainableBehaviorAlternatives: string[];
  projectedExposureReductionPercent: number;
  isFallback: boolean;
}
