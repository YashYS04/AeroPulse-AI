// ============================================================
// src/components/IAQ/WindowSchedule.tsx
// Inversion-aware window opening timetable & ventilation windows
// ============================================================

import React from 'react';
import { WINDOW_VENTILATION_TIMETABLE } from '@/lib/constants/iaq';

export const WindowSchedule: React.FC = React.memo(() => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Thermal Inversion Ventilation Timetable
        </h3>
        <span className="text-xs text-amber-300 font-semibold">
          Never open windows during morning stagnation
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {WINDOW_VENTILATION_TIMETABLE.map((slot) => {
          const isSafe = slot.status === 'Safe Full Flush';
          const isStrict = slot.status === 'Strictly Closed';

          return (
            <div
              key={slot.timeWindow}
              className={`p-3.5 rounded-xl border transition-all ${
                isSafe
                  ? 'bg-emerald-950/40 border-emerald-500/60 ring-1 ring-emerald-500/30'
                  : isStrict
                  ? 'bg-rose-950/20 border-rose-900/40'
                  : 'bg-amber-950/20 border-amber-900/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-extrabold text-white">{slot.timeWindow}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    isSafe
                      ? 'bg-emerald-500 text-slate-950'
                      : isStrict
                      ? 'bg-rose-600 text-white'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {slot.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">{slot.rationale}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
});

WindowSchedule.displayName = 'WindowSchedule';
