// ============================================================
// src/hooks/useAirAnalytics.ts
// Hook computing real-time environmental metrics & inversion state
// ============================================================

import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  calculateAQICategory,
  getAQIColor,
  evaluateInversionRisk,
} from '@/lib/compute';
import { AQICategory, InversionStatus } from '@/types/telemetry';

export interface AirAnalyticsSummary {
  currentAqi: number;
  aqiCategory: AQICategory;
  badgeHexColor: string;
  inversion: InversionStatus;
  primaryPollutant: string;
  clearingWindowHour: number;
}

export function useAirAnalytics(): AirAnalyticsSummary {
  const { activeZone } = useApp();

  return useMemo(() => {
    const aqiCategory = calculateAQICategory(activeZone.currentAqi);
    const badgeHexColor = getAQIColor(activeZone.currentAqi);
    const inversion = evaluateInversionRisk(
      activeZone.temperatureGround,
      activeZone.temperatureInversionCap,
      activeZone.windSpeedKmh
    );

    return {
      currentAqi: activeZone.currentAqi,
      aqiCategory,
      badgeHexColor,
      inversion,
      primaryPollutant: 'PM2.5 (Fine Combustion Soot)',
      clearingWindowHour: inversion.clearingHourExpected,
    };
  }, [activeZone]);
}
