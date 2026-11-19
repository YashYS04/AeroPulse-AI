// ============================================================
// src/lib/compute/dijkstraRouter.ts
// Graph traversal minimizing cumulative inhaled pollution exposure
// ============================================================

import { TransitNode, TransitEdge, TransitMode } from '@/types/transit';

export interface DijkstraResult {
  pathNodeIds: string[];
  totalDistanceKm: number;
  cumulativeExposureScore: number;
  usedModes: TransitMode[];
}

export function dijkstraLowestExposure(
  nodes: TransitNode[],
  edges: TransitEdge[],
  startId: string,
  endId: string,
  ambientAqiMultiplier: number = 1.0
): DijkstraResult | null {
  if (startId === endId) {
    return { pathNodeIds: [startId], totalDistanceKm: 0, cumulativeExposureScore: 0, usedModes: [] };
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, { nodeId: string; edge: TransitEdge } | null> = {};
  const unvisited = new Set<string>();

  for (const node of nodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  }

  distances[startId] = 0;

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let smallestDist = Infinity;
    for (const id of unvisited) {
      if (distances[id] < smallestDist) {
        smallestDist = distances[id];
        currentId = id;
      }
    }

    if (!currentId || smallestDist === Infinity) break;
    if (currentId === endId) break;

    unvisited.delete(currentId);

    // Find outgoing edges
    const outgoing = edges.filter((e) => e.from === currentId || e.to === currentId);
    for (const edge of outgoing) {
      const neighborId = edge.from === currentId ? edge.to : edge.from;
      if (!unvisited.has(neighborId)) continue;

      // Underground metro shields 85% of surface smog; outdoor diesel highways have penalty
      const exposureWeight = edge.isUnderground ? 0.20 : 1.25 * ambientAqiMultiplier;
      const stepCost = edge.distanceKm * exposureWeight;
      const candidateDist = distances[currentId] + stepCost;

      if (candidateDist < distances[neighborId]) {
        distances[neighborId] = candidateDist;
        previous[neighborId] = { nodeId: currentId, edge };
      }
    }
  }

  if (distances[endId] === Infinity) return null;

  // Reconstruct path
  const pathNodeIds: string[] = [];
  const usedModes: TransitMode[] = [];
  let curr: string | null = endId;
  let totalDistanceKm = 0;

  while (curr) {
    pathNodeIds.unshift(curr);
    const step: { nodeId: string; edge: TransitEdge } | null = previous[curr] ?? null;
    if (step) {
      totalDistanceKm += step.edge.distanceKm;
      if (!usedModes.includes(step.edge.mode)) usedModes.push(step.edge.mode);
      curr = step.nodeId;
    } else {
      curr = null;
    }
  }

  return {
    pathNodeIds,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    cumulativeExposureScore: Math.round(distances[endId] * 10) / 10,
    usedModes,
  };
}
