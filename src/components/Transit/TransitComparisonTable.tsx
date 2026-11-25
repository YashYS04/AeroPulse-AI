// ============================================================
// src/components/Transit/TransitComparisonTable.tsx
// Multi-modal transit exposure & emission comparison table
// ============================================================

import React from 'react';
import { TransitRouteOption } from '@/types/transit';

interface TransitComparisonTableProps {
  options: TransitRouteOption[];
}

export const TransitComparisonTable: React.FC<TransitComparisonTableProps> = React.memo(({ options }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Multi-Modal Inhaled Dose & Carbon Comparison
          </h3>
          <p className="text-xs text-slate-400">
            Microgram PM2.5 alveolar intake factoring transit speed, respiration ventilation rate & filtration
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <th className="py-2.5 px-3">Transit Mode</th>
              <th className="py-2.5 px-3">Duration</th>
              <th className="py-2.5 px-3">Inhaled PM2.5</th>
              <th className="py-2.5 px-3">Carbon (CO₂)</th>
              <th className="py-2.5 px-3">Health Tier</th>
              <th className="py-2.5 px-3">Advisory</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {options.map((opt) => {
              const tierBadge = {
                Optimal: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                Acceptable: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                Caution: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                Hazardous: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
              }[opt.relativeSafetyTier];

              return (
                <tr key={opt.mode} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-white whitespace-nowrap">{opt.mode}</td>
                  <td className="py-3 px-3 text-slate-300">{opt.durationMinutes} mins</td>
                  <td className="py-3 px-3 font-extrabold text-slate-100">
                    {opt.inhaledDosePM25Micrograms} µg
                  </td>
                  <td className="py-3 px-3 text-slate-400">{opt.co2EmissionsKg} kg</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${tierBadge}`}>
                      {opt.relativeSafetyTier}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px] max-w-xs truncate">
                    {opt.advisoryNote}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

TransitComparisonTable.displayName = 'TransitComparisonTable';
