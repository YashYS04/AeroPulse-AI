// ============================================================
// src/components/Dashboard/AirTelemetryDashboard.tsx
// Hyperlocal AQI & Multi-Pollutant Telemetry Dashboard
// ============================================================

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useAirAnalytics } from '@/hooks/useAirAnalytics';
import { UrbanZone } from '@/types/telemetry';
import { TelemetryStatusCards } from './TelemetryStatusCards';
import { SmogHeatmap } from './SmogHeatmap';
import { ZoneCard } from '../shared/ZoneCard';

function buildPollutantReadings(zone: UrbanZone) {
  return [
    { label: 'PM2.5', value: zone.pollutants.pm25, unit: 'µg/m³', maxSafe: 15, note: 'Fine Respirable Dust' },
    { label: 'PM10', value: zone.pollutants.pm10, unit: 'µg/m³', maxSafe: 45, note: 'Coarse Dust & Road Grit' },
    { label: 'NO2', value: zone.pollutants.no2, unit: 'ppb', maxSafe: 25, note: 'Diesel Engine Exhaust' },
    { label: 'CO', value: zone.pollutants.co, unit: 'ppm', maxSafe: 4.0, note: 'Incomplete Combustion' },
    { label: 'O3', value: zone.pollutants.o3, unit: 'ppb', maxSafe: 50, note: 'Photochemical Smog' },
  ];
}

/** Primary urban air quality dashboard with live telemetry, inversion physics, and zone selector. */
export const AirTelemetryDashboard: React.FC = React.memo(() => {
  const { state, dispatch, activeZone } = useApp();
  const { currentAqi, aqiCategory, badgeHexColor, inversion } = useAirAnalytics();
  const pollutants = buildPollutantReadings(activeZone);
  const selectZone = (id: string) => dispatch({ type: 'SELECT_ZONE', payload: id });

  return (
    <section aria-labelledby="dashboard-heading" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 id="dashboard-heading" className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Hyperlocal Telemetry & Atmospheric Inversion
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time multi-pollutant concentrations and ground boundary layer stagnation metrics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'TRIGGER_SMOG_SPIKE' })}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/60 shadow transition-all focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            ⚠️ Simulate Smog Spike
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: 'TRIGGER_SOLAR_CLEAN' })}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 shadow transition-all focus-visible:outline-2 focus-visible:outline-emerald-400"
          >
            ☀️ Simulate Solar Clearing
          </button>
          {(state.isSmogSimulated || state.isClearingSimulated) && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'RESET_TELEMETRY' })}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <TelemetryStatusCards
        activeZone={activeZone}
        currentAqi={currentAqi}
        aqiCategory={aqiCategory}
        badgeHexColor={badgeHexColor}
        inversion={inversion}
      />

      <SmogHeatmap zones={state.zones} selectedZoneId={state.selectedZoneId} onSelectZone={selectZone} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {pollutants.map((p) => (
          <div key={p.label} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 shadow">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-slate-200">{p.label}</span>
              <span>Safe: &lt;{p.maxSafe}</span>
            </div>
            <div className="mt-2 text-xl font-black text-white">
              {p.value} <span className="text-xs font-normal text-slate-400">{p.unit}</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1 truncate">{p.note}</span>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
          Urban Sectors Telemetry Feed
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              isSelected={zone.id === state.selectedZoneId}
              onSelect={selectZone}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

AirTelemetryDashboard.displayName = 'AirTelemetryDashboard';
