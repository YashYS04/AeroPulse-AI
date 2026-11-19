// ============================================================
// src/components/Transit/TransitPlanner.tsx
// Dijkstra Clean-Corridor Commute Routing & Exposure Minimizer
// ============================================================

import React from 'react';
import { useExposureRouting } from '@/hooks/useExposureRouting';
import { TransitComparisonTable } from './TransitComparisonTable';

export const TransitPlanner: React.FC = React.memo(() => {
  const {
    nodes,
    startNodeId,
    endNodeId,
    setStartNodeId,
    setEndNodeId,
    optimalDijkstra,
    multiModalComparisons,
  } = useExposureRouting();

  return (
    <section aria-labelledby="transit-heading" className="space-y-6">
      <div>
        <h2 id="transit-heading" className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Clean-Corridor Transit & Commute Exposure Router
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Dijkstra pathfinding avoiding stagnant surface diesel canyons in favor of filtered underground rail
        </p>
      </div>

      {/* Origin & Destination Selectors */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Configure Commute Corridor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start-node-select" className="text-xs font-semibold text-slate-300 block mb-1">
              Origin Station:
            </label>
            <select
              id="start-node-select"
              value={startNodeId}
              onChange={(e) => setStartNodeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 text-slate-200 text-xs sm:text-sm rounded-xl p-3 focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name} ({node.sector})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="end-node-select" className="text-xs font-semibold text-slate-300 block mb-1">
              Destination Station:
            </label>
            <select
              id="end-node-select"
              value={endNodeId}
              onChange={(e) => setEndNodeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-750 text-slate-200 text-xs sm:text-sm rounded-xl p-3 focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name} ({node.sector})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dijkstra Path Result Banner */}
        {optimalDijkstra && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                ✓ Dijkstra Lowest-Exposure Clean Corridor Identified
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Path:{' '}
                {optimalDijkstra.pathNodeIds
                  .map((id) => nodes.find((n) => n.id === id)?.name || id)
                  .join(' ➔ ')}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-semibold">
                Total: <strong>{optimalDijkstra.totalDistanceKm} km</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                Exposure Score: {optimalDijkstra.cumulativeExposureScore}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Multi-modal table */}
      <TransitComparisonTable options={multiModalComparisons} />
    </section>
  );
});

TransitPlanner.displayName = 'TransitPlanner';
