// ============================================================
// src/components/Routine/RoutineTimeline.tsx
// Hour-by-hour exposure timeline and safe outdoor windows
// ============================================================

import React from 'react';
import { RoutineHour } from '@/types/routine';
import { getAQIColor } from '@/lib/compute';

interface RoutineTimelineProps {
  hours: RoutineHour[];
}

export const RoutineTimeline: React.FC<RoutineTimelineProps> = React.memo(({ hours }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Hour-by-Hour Smog Exposure & Activity Schedule
        </h3>
        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Safe Midday Convection Window
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {hours.map((item) => {
          const color = getAQIColor(item.predictedAqi);
          return (
            <div
              key={item.hour}
              className={`p-3 rounded-xl border transition-all ${
                item.isSafeOutdoorWindow
                  ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-extrabold text-slate-200">{item.label}</span>
                <span
                  className="px-2 py-0.5 rounded text-[11px] font-black text-white"
                  style={{ backgroundColor: color }}
                >
                  {item.predictedAqi} AQI
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium line-clamp-2 mb-2">
                {item.activityRecommendation}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                <span className={item.maskRequired ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                  {item.maskRequired ? '😷 Mask Advised' : 'No Mask Indoors'}
                </span>
                <span className="text-slate-400">
                  Purifier: <strong className="text-slate-200">{item.purifierSetting}</strong>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

RoutineTimeline.displayName = 'RoutineTimeline';
