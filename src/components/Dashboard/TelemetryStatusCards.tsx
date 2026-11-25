// ============================================================
// src/components/Dashboard/TelemetryStatusCards.tsx
// Sector AQI Hero Card & Atmospheric Boundary Layer Inversion Model
// ============================================================

import React from 'react';
import { AQICategory, InversionStatus, UrbanZone } from '@/types/telemetry';

interface TelemetryStatusCardsProps {
  activeZone: UrbanZone;
  currentAqi: number;
  aqiCategory: AQICategory;
  badgeHexColor: string;
  inversion: InversionStatus;
}

/** Displays live zone AQI hero telemetry alongside thermal inversion lapse rate metrics. */
export const TelemetryStatusCards: React.FC<TelemetryStatusCardsProps> = React.memo(({
  activeZone,
  currentAqi,
  aqiCategory,
  badgeHexColor,
  inversion,
}) => {
  const inversionMetrics = [
    {
      label: 'Lapse Rate (ΔT)',
      value: `${inversion.lapseRateDelta > 0 ? `+${inversion.lapseRateDelta}` : inversion.lapseRateDelta}°C`,
      note: 'T_cap - T_ground',
      colorClass: 'text-white',
    },
    {
      label: 'Stagnation Index',
      value: `${(inversion.stagnationIndex * 100).toFixed(0)}% Stagnant`,
      note: 'Wind < 6 km/h',
      colorClass: 'text-amber-300',
    },
    {
      label: 'Solar Convection Lift',
      value: `~${inversion.clearingHourExpected}:00 PM`,
      note: 'Expected Cap Opening',
      colorClass: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-slate-400">Selected Sector Status</span>
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-extrabold text-white"
            style={{ backgroundColor: badgeHexColor }}
          >
            {aqiCategory}
          </span>
        </div>
        <div className="my-4">
          <div className="text-5xl font-black text-white tracking-tighter flex items-baseline gap-2">
            <span>{currentAqi}</span>
            <span className="text-sm font-semibold text-slate-400">US-EPA AQI</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-medium">{activeZone.name}</p>
        </div>
        <div className="text-xs text-slate-400 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span>Ground Temp: {activeZone.temperatureGround}°C</span>
          <span>Wind: {activeZone.windSpeedKmh} km/h</span>
        </div>
      </div>

      <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            Atmospheric Boundary Layer Model
          </h3>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
              inversion.isInversionActive
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {inversion.severity === 'None' ? 'No Inversion' : `${inversion.severity} Inversion Active`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
          {inversionMetrics.map((m) => (
            <div key={m.label} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">{m.label}</span>
              <strong className={`text-lg font-bold ${m.colorClass}`}>{m.value}</strong>
              <span className="text-[10px] text-slate-400 block">{m.note}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-300 font-medium">{inversion.advisoryText}</p>
      </div>
    </div>
  );
});

TelemetryStatusCards.displayName = 'TelemetryStatusCards';
