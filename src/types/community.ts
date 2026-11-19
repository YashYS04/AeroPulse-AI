// ============================================================
// src/types/community.ts
// Neighborhood collective pledges, offsets, and alerts
// ============================================================

export enum PledgeCategory {
  CleanTransit = 'Clean Transit',
  ZeroWasteBurning = 'Zero Open Burning',
  EnergyResilience = 'Clean Indoor Heating',
  VulnerableCare = 'Vulnerable Neighbor Support',
}

export interface CommunityPledge {
  id: string;
  category: PledgeCategory;
  title: string;
  description: string;
  dailyCo2AvoidedKg: number;
  dailyPm25AvoidedGrams: number;
  activePledgersCount: number;
  isUserJoined: boolean;
}

export interface CommunityAlert {
  id: string;
  severity: 'Info' | 'Warning' | 'Critical';
  title: string;
  message: string;
  timestamp: string;
  affectedZones: string[];
}
