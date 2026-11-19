// ============================================================
// src/types/telemetry.ts
// Strict domain definitions for AQI, pollutants, and sensors
// ============================================================

export enum AQICategory {
  Good = 'Good',
  Moderate = 'Moderate',
  UnhealthySensitive = 'Unhealthy for Sensitive Groups',
  Unhealthy = 'Unhealthy',
  VeryUnhealthy = 'Very Unhealthy',
  Hazardous = 'Hazardous',
}

export enum PollutantType {
  PM25 = 'PM2.5',
  PM10 = 'PM10',
  NO2 = 'NO2',
  CO = 'CO',
  O3 = 'O3',
}

export interface PollutantConcentrations {
  pm25: number; // ug/m3
  pm10: number; // ug/m3
  no2: number;  // ppb
  co: number;   // ppm
  o3: number;   // ppb
}

export interface UrbanZone {
  id: string;
  name: string;
  sector: string;
  coordinates: [number, number];
  currentAqi: number;
  pollutants: PollutantConcentrations;
  temperatureGround: number; // Celsius
  temperatureInversionCap: number; // Celsius (boundary layer)
  windSpeedKmh: number;
  humidityPercent: number;
  historyAqi: number[]; // Last 7 hours
}

export interface InversionStatus {
  isInversionActive: boolean;
  severity: 'None' | 'Moderate' | 'Severe';
  lapseRateDelta: number; // T_cap - T_ground
  stagnationIndex: number; // 0 (active airflow) to 1 (complete stagnation)
  clearingHourExpected: number; // 24-hr format (e.g. 13 for 1:00 PM)
  advisoryText: string;
}
