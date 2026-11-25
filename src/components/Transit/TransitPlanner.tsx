// ============================================================
// src/components/Transit/TransitPlanner.tsx
// Dijkstra Clean-Corridor Commute Routing & Exposure Minimizer
// ============================================================

import React from 'react';
import { useExposureRouting } from '@/hooks/useExposureRouting';
import { TransitNode } from '@/types/transit';
import { TransitComparisonTable } from './TransitComparisonTable';

interface StationSelectProps {
  id: string;
  label: string;
  value: string;
  nodes: TransitNode[];
  onChange: (nodeId: string) => void;
}

const StationSelect: React.FC<StationSelectProps> = ({ id, label, value, nodes, onChange }) => (
  <div>
    <label htmlFor={id} className="text-xs font-semibold text-slate-300 block mb-1">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs sm:text-sm rounded-xl p-3 focus-visible:outline-2 focus-visible:outline-emerald-400"
    >
      {nodes.map((node) => (
        <option key={node.id} value={node.id}>
          {node.name} ({node.sector})
        </option>
      ))}
    </select>
  </div>
);

/** Interactive clean-corridor commute exposure planner powered by Dijkstra shortest exposure routing. */
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

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Configure Commute Corridor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StationSelect
            id="start-node-select"
            label="Origin Station:"
            value={startNodeId}
            nodes={nodes}
            onChange={setStartNodeId}
          />
          <StationSelect
            id="end-node-select"
            label="Destination Station:"
            value={endNodeId}
            nodes={nodes}
            onChange={setEndNodeId}
          />
        </div>

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

      <TransitComparisonTable options={multiModalComparisons} />
    </section>
  );
});

TransitPlanner.displayName = 'TransitPlanner';
