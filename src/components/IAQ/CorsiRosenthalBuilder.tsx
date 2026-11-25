// ============================================================
// src/components/IAQ/CorsiRosenthalBuilder.tsx
// Interactive Room CADR & Corsi-Rosenthal Box Sizing Calculator
// ============================================================

import React, { useState, useMemo } from 'react';
import { computeRoomCADRProfile } from '@/lib/compute/cadrCalculations';

interface SliderConfig {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
}

/** Interactive ASHRAE 4 ACH room CADR and DIY Corsi-Rosenthal unit sizing calculator. */
export const CorsiRosenthalBuilder: React.FC = React.memo(() => {
  const [lengthM, setLengthM] = useState<number>(5.0);
  const [widthM, setWidthM] = useState<number>(4.0);
  const [heightM, setHeightM] = useState<number>(2.8);
  const [targetAch, setTargetAch] = useState<number>(4);

  const profile = useMemo(
    () => computeRoomCADRProfile(lengthM, widthM, heightM, targetAch, 380),
    [lengthM, widthM, heightM, targetAch]
  );

  const sliders: SliderConfig[] = [
    { id: 'room-length', label: 'Length', unit: 'm', min: 2.0, max: 12.0, step: 0.5, value: lengthM, onChange: setLengthM },
    { id: 'room-width', label: 'Width', unit: 'm', min: 2.0, max: 10.0, step: 0.5, value: widthM, onChange: setWidthM },
    { id: 'room-height', label: 'Height', unit: 'm', min: 2.0, max: 4.5, step: 0.1, value: heightM, onChange: setHeightM },
    { id: 'target-ach', label: 'Target ACH', unit: '/ hr', min: 2, max: 6, step: 1, value: targetAch, onChange: setTargetAch },
  ];

  const metricCards = [
    { label: 'Room Volume', value: `${profile.roomVolumeM3} m³`, colorClass: 'text-white' },
    { label: 'Required CADR', value: `${profile.requiredCADRm3h} m³/h`, colorClass: 'text-emerald-400' },
    { label: '90% Clearance Time', value: `${profile.clearanceTimeMinutes} mins`, colorClass: 'text-blue-400' },
    { label: 'Recommended DIY Units', value: `${profile.recommendedUnitsCount} Box Fan`, colorClass: 'text-amber-300' },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Room CADR & Air Changes Calculator (ASHRAE 4 ACH Standard)
          </h3>
          <p className="text-xs text-slate-400">
            Determine required Clean Air Delivery Rate and particle clearance duration for your home
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold w-fit">
          Standard: 4 to 5 ACH
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {sliders.map((s) => (
          <div key={s.id}>
            <label htmlFor={s.id} className="text-xs font-semibold text-slate-300 block mb-1">
              {s.label}: {s.value} {s.unit}
            </label>
            <input
              id={s.id}
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.onChange(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
        {metricCards.map((m) => (
          <div key={m.label} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block">{m.label}</span>
            <strong className={`text-xl font-black ${m.colorClass}`}>{m.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
});

CorsiRosenthalBuilder.displayName = 'CorsiRosenthalBuilder';
