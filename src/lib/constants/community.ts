// ============================================================
// src/lib/constants/community.ts
// Collective community pledges, emissions savings, & alerts
// ============================================================

import { CommunityPledge, CommunityAlert, PledgeCategory } from '@/types/community';

export const INITIAL_COMMUNITY_PLEDGES: CommunityPledge[] = [
  {
    id: 'pledge-metro-carpool',
    category: PledgeCategory.CleanTransit,
    title: 'Switch Commute to Metro or Zero-Emission Carpool',
    description: 'Commit to leaving private gasoline vehicles parked on high-smog inversion days (AQI > 200).',
    dailyCo2AvoidedKg: 4.8,
    dailyPm25AvoidedGrams: 14.5,
    activePledgersCount: 428,
    isUserJoined: true,
  },
  {
    id: 'pledge-zero-waste-burning',
    category: PledgeCategory.ZeroWasteBurning,
    title: 'Zero Open Biomass & Leaf Burning Vigilance',
    description: 'Report nocturnal open burning of fallen leaves, garbage, or plastics to local municipal helplines.',
    dailyCo2AvoidedKg: 8.5,
    dailyPm25AvoidedGrams: 85.0,
    activePledgersCount: 612,
    isUserJoined: false,
  },
  {
    id: 'pledge-clean-heating',
    category: PledgeCategory.EnergyResilience,
    title: 'Adopt Electric Heat Pumps or Clean Heating',
    description: 'Avoid unvented kerosene or smoky charcoal room stoves; use thermostat-controlled ceramic or heat pump heating.',
    dailyCo2AvoidedKg: 6.2,
    dailyPm25AvoidedGrams: 32.0,
    activePledgersCount: 319,
    isUserJoined: false,
  },
  {
    id: 'pledge-neighbor-support',
    category: PledgeCategory.VulnerableCare,
    title: 'Vulnerable Neighbor Air Check & Filter Sharing',
    description: 'Check in on elderly neighbors and asthmatic children during code-purple smog peaks; share spare MERV-13 filters.',
    dailyCo2AvoidedKg: 1.0,
    dailyPm25AvoidedGrams: 5.0,
    activePledgersCount: 204,
    isUserJoined: true,
  },
];

export const INITIAL_COMMUNITY_ALERTS: CommunityAlert[] = [
  {
    id: 'alert-smog-inversion-1',
    severity: 'Critical',
    title: 'Severe Ground Inversion Warning Active',
    message: 'Lapse rate inversion cap at 180m trapping PM2.5 at 282 ug/m3 in North Industrial Belt. All schools outdoor athletics cancelled.',
    timestamp: '07:15 AM Today',
    affectedZones: ['zone-industrial', 'zone-cbd', 'zone-transit'],
  },
  {
    id: 'alert-convection-window',
    severity: 'Info',
    title: 'Convection Window Forecast (1:00 PM - 4:00 PM)',
    message: 'Solar heating expected to lift boundary cap. Optimal time for 15-minute room ventilation and essential transit.',
    timestamp: '08:30 AM Today',
    affectedZones: ['zone-greenwood', 'zone-riverside'],
  },
];
