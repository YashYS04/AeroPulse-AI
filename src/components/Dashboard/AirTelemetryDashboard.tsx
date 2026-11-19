// ============================================================
// src/components/Dashboard/AirTelemetryDashboard.tsx
// Hyperlocal AQI & Multi-Pollutant Telemetry Dashboard
// ============================================================

import React from 'react';
import { useApp } from '@/context/AppContext';
import { useAirAnalytics } from '@/hooks/useAirAnalytics';
import { SmogHeatmap } from './SmogHeatmap';
import { ZoneCard } from '../shared/ZoneCard';

export const AirTelemetryDashboard: React.FC = React.memo(() => {
  const { state, dispatch, activeZone } = useApp();
  const { currentAqi, aqiCategory, badgeHexColor, inversion } = useAirAnalytics();

  const pollutants = [
    { label: 'PM2.5', value: activeZone.pollutants.pm25, unit: 'µg/m³', maxSafe: 15, note: 'Fine Respirable Dust' },
    { label: 'PM10', value: activeZone.pollutants.pm10, unit: 'µg/m³', maxSafe: 45, note: 'Coarse Dust & Road Grit' },
    { label: 'NO2', value: activeZone.pollutants.no2, unit: 'ppb', maxSafe: 25, note: 'Diesel Engine Exhaust' },
    { label: 'CO', value: activeZone.pollutants.co, unit: 'ppm', maxSafe: 4.0, note: 'Incomplete Combustion' },
    { label: 'O3', value: activeZone.pollutants.o3, unit: 'ppb', maxSafe: 50, note: 'Photochemical Smog' },
  ];

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

        {/* Simulation Controls */}
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
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-750 focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Stats Row: AQI Hero Card + Atmospheric Inversion Card */}
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

        {/* Thermal Inversion Analysis Card */}
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
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Lapse Rate (ΔT)</span>
              <strong className="text-lg font-bold text-white">
                {inversion.lapseRateDelta > 0 ? `+${inversion.lapseRateDelta}` : inversion.lapseRateDelta}°C
              </strong>
              <span className="text-[10px] text-slate-400 block">T_cap - T_ground</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Stagnation Index</span>
              <strong className="text-lg font-bold text-amber-300">
                {(inversion.stagnationIndex * 100).toFixed(0)}% Stagnant
              </strong>
              <span className="text-[10px] text-slate-400 block">Wind &lt; 6 km/h</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Solar Convection Lift</span>
              <strong className="text-lg font-bold text-emerald-400">
                ~{inversion.clearingHourExpected}:00 PM
              </strong>
              <span className="text-[10px] text-slate-400 block">Expected Cap Opening</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-medium">{inversion.advisoryText}</p>
        </div>
      </div>

      {/* SVG Spatial Topography */}
      <SmogHeatmap
        zones={state.zones}
        selectedZoneId={state.selectedZoneId}
        onSelectZone={(id) => dispatch({ type: 'SELECT_ZONE', payload: id })}
      />

      {/* Pollutant Breakdown Cards */}
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

      {/* Urban Zones Selection Grid */}
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
              onSelect={(id) => dispatch({ type: 'SELECT_ZONE', payload: id })}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

AirTelemetryDashboard.displayName = 'AirTelemetryDashboard';
