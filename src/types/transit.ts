// ============================================================
// src/types/transit.ts
// Multi-modal transit and graph pathfinding types
// ============================================================

export enum TransitMode {
  UndergroundMetro = 'Underground Metro',
  ElectricBus = 'Electric AC Bus',
  DieselBus = 'Standard Diesel Bus',
  ElectricVehicle = 'Electric Vehicle (HEPA Cabin)',
  GasolineCar = 'Gasoline Car (Standard Cabin)',
  Cycling = 'Cycling (High Ventilation)',
  Walking = 'Walking (Moderate Ventilation)',
}

export interface TransitRouteOption {
  mode: TransitMode;
  durationMinutes: number;
  distanceKm: number;
  inhaledDosePM25Micrograms: number;
  co2EmissionsKg: number;
  relativeSafetyTier: 'Optimal' | 'Acceptable' | 'Caution' | 'Hazardous';
  advisoryNote: string;
}

export interface TransitNode {
  id: string;
  name: string;
  sector: string;
  baselineExposureRate: number; // Factor 0.5 to 2.5
}

export interface TransitEdge {
  from: string;
  to: string;
  distanceKm: number;
  mode: TransitMode;
  isUnderground: boolean;
}
