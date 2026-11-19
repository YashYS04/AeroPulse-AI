// ============================================================
// src/lib/constants/transit.ts
// Graph nodes and edges for clean-corridor Dijkstra routing
// ============================================================

import { TransitNode, TransitEdge, TransitMode } from '@/types/transit';

export const TRANSIT_NODES: TransitNode[] = [
  { id: 'node-cbd', name: 'Central Connaught Hub', sector: 'CBD', baselineExposureRate: 1.8 },
  { id: 'node-metro-hub', name: 'Grand Central Subterranean Station', sector: 'Transit Core', baselineExposureRate: 0.3 },
  { id: 'node-suburb-north', name: 'North Residential Valley', sector: 'North Suburbs', baselineExposureRate: 1.2 },
  { id: 'node-eco-park', name: 'Riverside Botanical Parkway', sector: 'Eco Corridor', baselineExposureRate: 0.5 },
  { id: 'node-industrial-gate', name: 'Industrial Sector 9 Terminal', sector: 'Industrial', baselineExposureRate: 2.4 },
  { id: 'node-south-hills', name: 'South Green Ridge', sector: 'South Hills', baselineExposureRate: 0.8 },
];

export const TRANSIT_EDGES: TransitEdge[] = [
  // Underground Metro Corridor (Low exposure)
  { from: 'node-cbd', to: 'node-metro-hub', distanceKm: 3.2, mode: TransitMode.UndergroundMetro, isUnderground: true },
  { from: 'node-metro-hub', to: 'node-eco-park', distanceKm: 4.8, mode: TransitMode.UndergroundMetro, isUnderground: true },
  { from: 'node-metro-hub', to: 'node-south-hills', distanceKm: 6.1, mode: TransitMode.UndergroundMetro, isUnderground: true },

  // Surface Road Links (Higher particulate exposure)
  { from: 'node-cbd', to: 'node-industrial-gate', distanceKm: 5.5, mode: TransitMode.DieselBus, isUnderground: false },
  { from: 'node-industrial-gate', to: 'node-suburb-north', distanceKm: 4.2, mode: TransitMode.GasolineCar, isUnderground: false },
  { from: 'node-suburb-north', to: 'node-eco-park', distanceKm: 7.0, mode: TransitMode.ElectricBus, isUnderground: false },
  { from: 'node-eco-park', to: 'node-south-hills', distanceKm: 3.5, mode: TransitMode.Cycling, isUnderground: false },
  { from: 'node-cbd', to: 'node-suburb-north', distanceKm: 8.4, mode: TransitMode.GasolineCar, isUnderground: false },
];
