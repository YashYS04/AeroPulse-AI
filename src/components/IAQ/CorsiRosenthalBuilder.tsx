// ============================================================
// src/components/IAQ/CorsiRosenthalBuilder.tsx
// Interactive Room CADR & Corsi-Rosenthal Box Sizing Calculator
// ============================================================

import React, { useState, useMemo } from 'react';
import { computeRoomCADRProfile } from '@/lib/compute/cadrCalculations';

export const CorsiRosenthalBuilder: React.FC = React.memo(() => {
  const [lengthM, setLengthM] = useState<number>(5.0);
  const [widthM, setWidthM] = useState<number>(4.0);
  const [heightM, setHeightM] = useState<number>(2.8);
  const [targetAch, setTargetAch] = useState<number>(4);

  const profile = useMemo(() => {
    return computeRoomCADRProfile(lengthM, widthM, heightM, targetAch, 380);
  }, [lengthM, widthM, heightM, targetAch]);

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

      {/* Input sliders/controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div>
          <label htmlFor="room-length" className="text-xs font-semibold text-slate-300 block mb-1">
            Length: {lengthM} m
          </label>
          <input
            id="room-length"
            type="range"
            min="2.0"
            max="12.0"
            step="0.5"
            value={lengthM}
            onChange={(e) => setLengthM(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="room-width" className="text-xs font-semibold text-slate-300 block mb-1">
            Width: {widthM} m
          </label>
          <input
            id="room-width"
            type="range"
            min="2.0"
            max="10.0"
            step="0.5"
            value={widthM}
            onChange={(e) => setWidthM(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="room-height" className="text-xs font-semibold text-slate-300 block mb-1">
            Height: {heightM} m
          </label>
          <input
            id="room-height"
            type="range"
            min="2.0"
            max="4.5"
            step="0.1"
            value={heightM}
            onChange={(e) => setHeightM(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="target-ach" className="text-xs font-semibold text-slate-300 block mb-1">
            Target ACH: {targetAch} / hr
          </label>
          <input
            id="target-ach"
            type="range"
            min="2"
            max="6"
            step="1"
            value={targetAch}
            onChange={(e) => setTargetAch(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500"
          />
        </div>
      </div>

      {/* Output Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block">Room Volume</span>
          <strong className="text-xl font-black text-white">{profile.roomVolumeM3} m³</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block">Required CADR</span>
          <strong className="text-xl font-black text-emerald-400">{profile.requiredCADRm3h} m³/h</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block">90% Clearance Time</span>
          <strong className="text-xl font-black text-blue-400">{profile.clearanceTimeMinutes} mins</strong>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block">Recommended DIY Units</span>
          <strong className="text-xl font-black text-amber-300">
            {profile.recommendedUnitsCount} Box Fan
          </strong>
        </div>
      </div>
    </div>
  );
});

CorsiRosenthalBuilder.displayName = 'CorsiRosenthalBuilder';
