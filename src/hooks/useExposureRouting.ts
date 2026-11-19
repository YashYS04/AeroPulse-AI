// ============================================================
// src/hooks/useExposureRouting.ts
// Hook computing Dijkstra path and multi-modal comparison options
// ============================================================

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { TRANSIT_NODES, TRANSIT_EDGES } from '@/lib/constants/transit';
import {
  dijkstraLowestExposure,
  calculateCommuteMetrics,
  DijkstraResult,
} from '@/lib/compute';
import { TransitMode, TransitRouteOption } from '@/types/transit';

export function useExposureRouting() {
  const { activeZone } = useApp();
  const [startNodeId, setStartNodeId] = useState<string>('node-cbd');
  const [endNodeId, setEndNodeId] = useState<string>('node-south-hills');

  const optimalDijkstra = useMemo<DijkstraResult | null>(() => {
    const aqiMultiplier = activeZone.currentAqi / 100;
    return dijkstraLowestExposure(
      TRANSIT_NODES,
      TRANSIT_EDGES,
      startNodeId,
      endNodeId,
      aqiMultiplier
    );
  }, [activeZone.currentAqi, startNodeId, endNodeId]);

  const multiModalComparisons = useMemo<TransitRouteOption[]>(() => {
    const distanceKm = optimalDijkstra?.totalDistanceKm || 8.0;
    const modes: TransitMode[] = [
      TransitMode.UndergroundMetro,
      TransitMode.ElectricBus,
      TransitMode.DieselBus,
      TransitMode.ElectricVehicle,
      TransitMode.GasolineCar,
      TransitMode.Cycling,
      TransitMode.Walking,
    ];

    return modes.map((mode) =>
      calculateCommuteMetrics(mode, distanceKm, activeZone.pollutants.pm25)
    );
  }, [optimalDijkstra, activeZone.pollutants.pm25]);

  return {
    nodes: TRANSIT_NODES,
    startNodeId,
    endNodeId,
    setStartNodeId,
    setEndNodeId,
    optimalDijkstra,
    multiModalComparisons,
  };
}
