// ============================================================
// src/components/IAQ/DIYHackGrid.tsx
// Open-source DIY air cleaning blueprints & materials
// ============================================================

import React from 'react';
import { DIY_AIR_HACKS } from '@/lib/constants/iaq';

export const DIYHackGrid: React.FC = React.memo(() => {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Open-Source DIY Clean Air Hacks ($18 – $45 Blueprints)
        </h3>
        <p className="text-xs text-slate-400">
          Scientifically validated low-cost filtration alternatives to $350+ commercial purifiers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DIY_AIR_HACKS.map((hack) => (
          <div
            key={hack.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-base font-bold text-white tracking-tight">{hack.title}</h4>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs">
                  ${hack.estimatedCostUsd}
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-3">{hack.description}</p>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery CADR:</span>
                  <strong className="text-emerald-400">{hack.deliveryCADRm3h} m³/h</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Build Time:</span>
                  <strong className="text-slate-200">~{hack.buildTimeMinutes} minutes</strong>
                </div>
              </div>

              <div className="text-xs text-slate-300">
                <span className="font-bold text-slate-200 block mb-1">Key Materials:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
                  {hack.materialsNeeded.slice(0, 3).map((mat, i) => (
                    <li key={i}>{mat}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span>✓ {hack.efficiencyRating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

DIYHackGrid.displayName = 'DIYHackGrid';
