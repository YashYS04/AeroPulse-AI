// ============================================================
// src/components/shared/ZoneCard.tsx
// Compact interactive card for urban zone telemetry
// ============================================================

import React from 'react';
import { UrbanZone } from '@/types/telemetry';
import { calculateAQICategory, getAQIColor } from '@/lib/compute';
import { Sparkline } from './Sparkline';

interface ZoneCardProps {
  zone: UrbanZone;
  isSelected: boolean;
  onSelect: (zoneId: string) => void;
}

export const ZoneCard: React.FC<ZoneCardProps> = React.memo(({
  zone,
  isSelected,
  onSelect,
}) => {
  const category = calculateAQICategory(zone.currentAqi);
  const color = getAQIColor(zone.currentAqi);
  const isInverted = zone.temperatureInversionCap > zone.temperatureGround;

  return (
    <button
      type="button"
      onClick={() => onSelect(zone.id)}
      aria-pressed={isSelected}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-emerald-400 ${
        isSelected
          ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold text-slate-400 block">{zone.sector}</span>
          <h3 className="text-base font-bold text-white tracking-tight">{zone.name}</h3>
        </div>
        <div
          className="px-3 py-1 rounded-lg text-sm font-extrabold text-white flex items-center gap-1 shadow-inner"
          style={{ backgroundColor: color }}
          aria-label={`AQI ${zone.currentAqi}, category ${category}`}
        >
          <span>{zone.currentAqi}</span>
          <span className="text-xs font-normal opacity-90">AQI</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
        <div>
          <span>PM2.5: </span>
          <strong className="text-slate-100">{zone.pollutants.pm25} µg/m³</strong>
        </div>
        {isInverted && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40">
            ⚠️ Inversion Active
          </span>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">7-Hour Trend</span>
        <Sparkline data={zone.historyAqi} color={color} label={zone.name} />
      </div>
    </button>
  );
});

ZoneCard.displayName = 'ZoneCard';
