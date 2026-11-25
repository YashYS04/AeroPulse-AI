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

type PrevStep = { nodeId: string; edge: TransitEdge } | null;

const UNDERGROUND_WEIGHT = 0.20;
const SURFACE_PENALTY_FACTOR = 1.25;

function pickClosestUnvisited(
  unvisited: Set<string>,
  distances: Record<string, number>
): { currentId: string | null; smallestDist: number } {
  let currentId: string | null = null;
  let smallestDist = Infinity;

  for (const id of unvisited) {
    if (distances[id] < smallestDist) {
      smallestDist = distances[id];
      currentId = id;
    }
  }
  return { currentId, smallestDist };
}

function relaxNeighbors(
  currentId: string,
  edges: TransitEdge[],
  unvisited: Set<string>,
  distances: Record<string, number>,
  previous: Record<string, PrevStep>,
  ambientAqiMultiplier: number
): void {
  const outgoing = edges.filter((e) => e.from === currentId || e.to === currentId);
  for (const edge of outgoing) {
    const neighborId = edge.from === currentId ? edge.to : edge.from;
    if (!unvisited.has(neighborId)) continue;

    // Underground metro shields 85% of surface smog; surface arteries carry inversion penalty
    const exposureWeight = edge.isUnderground
      ? UNDERGROUND_WEIGHT
      : SURFACE_PENALTY_FACTOR * ambientAqiMultiplier;
    const candidateDist = distances[currentId] + edge.distanceKm * exposureWeight;

    if (candidateDist < distances[neighborId]) {
      distances[neighborId] = candidateDist;
      previous[neighborId] = { nodeId: currentId, edge };
    }
  }
}

function reconstructRoute(
  endId: string,
  distances: Record<string, number>,
  previous: Record<string, PrevStep>
): DijkstraResult {
  const pathNodeIds: string[] = [];
  const usedModes: TransitMode[] = [];
  let curr: string | null = endId;
  let totalDistanceKm = 0;

  while (curr) {
    pathNodeIds.unshift(curr);
    const step: PrevStep = previous[curr] ?? null;
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

/**
 * Finds the transit path minimizing cumulative inhaled PM2.5 exposure via Dijkstra's algorithm.
 */
export function dijkstraLowestExposure(
  nodes: TransitNode[],
  edges: TransitEdge[],
  startId: string,
  endId: string,
  ambientAqiMultiplier = 1.0
): DijkstraResult | null {
  if (startId === endId) {
    return { pathNodeIds: [startId], totalDistanceKm: 0, cumulativeExposureScore: 0, usedModes: [] };
  }

  const distances: Record<string, number> = {};
  const previous: Record<string, PrevStep> = {};
  const unvisited = new Set<string>();

  for (const node of nodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  }
  distances[startId] = 0;

  while (unvisited.size > 0) {
    const { currentId, smallestDist } = pickClosestUnvisited(unvisited, distances);
    if (!currentId || smallestDist === Infinity || currentId === endId) break;
    unvisited.delete(currentId);
    relaxNeighbors(currentId, edges, unvisited, distances, previous, ambientAqiMultiplier);
  }

  return distances[endId] === Infinity ? null : reconstructRoute(endId, distances, previous);
}
