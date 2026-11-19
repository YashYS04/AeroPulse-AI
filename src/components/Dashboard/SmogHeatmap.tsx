// ============================================================
// src/components/Dashboard/SmogHeatmap.tsx
// Native SVG Urban Sector Heatmap with Inversion Ceiling & WCAG Twins
// ============================================================

import React from 'react';
import { UrbanZone } from '@/types/telemetry';
import { getAQIColor } from '@/lib/compute';

interface SmogHeatmapProps {
  zones: UrbanZone[];
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
}

export const SmogHeatmap: React.FC<SmogHeatmapProps> = React.memo(({
  zones,
  selectedZoneId,
  onSelectZone,
}) => {
  // Sector layout coordinates for native SVG canvas
  const nodePositions: Record<string, { x: number; y: number }> = {
    'zone-cbd': { x: 300, y: 190 },
    'zone-industrial': { x: 130, y: 110 },
    'zone-greenwood': { x: 470, y: 120 },
    'zone-riverside': { x: 500, y: 250 },
    'zone-transit': { x: 210, y: 260 },
  };

  return (
    <div className="relative bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Spatial Urban Heatmap & Thermal Inversion Ceiling
          </h3>
          <p className="text-xs text-slate-400">
            Interactive sector topography showing ground stagnation and boundary layer lid
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> &lt;50
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 51-150
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 151-300
          </span>
          <span className="flex items-center gap-1.5 text-red-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-950 border border-red-500" /> 300+
          </span>
        </div>
      </div>

      <div className="w-full aspect-[2/1] min-h-[260px] relative overflow-hidden rounded-xl bg-[#070b12] border border-slate-800/80">
        <svg
          viewBox="0 0 640 320"
          className="w-full h-full select-none"
          role="img"
          aria-label="Urban spatial smog telemetry heatmap visualizer"
        >
          {/* Background grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
            {/* Smog Inversion Boundary Layer Gradient */}
            <linearGradient id="inversionGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <rect width="640" height="320" fill="url(#grid)" />
          <rect y="40" width="640" height="180" fill="url(#inversionGlow)" />

          {/* Nocturnal Inversion Cap Line */}
          <line x1="20" y1="50" x2="620" y2="50" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="6,4" />
          <text x="30" y="44" fill="#fda4af" fontSize="10" fontWeight="bold">
            THERMAL INVERSION LID (180m Boundary Layer) — Trapping Smog Beneath
          </text>

          {/* Sector Connection Links */}
          <line x1="300" y1="190" x2="130" y2="110" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="300" y1="190" x2="470" y2="120" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="300" y1="190" x2="500" y2="250" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="300" y1="190" x2="210" y2="260" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />
          <line x1="130" y1="110" x2="210" y2="260" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />

          {/* Zone Nodes */}
          {zones.map((zone) => {
            const pos = nodePositions[zone.id] || { x: 300, y: 150 };
            const isSelected = zone.id === selectedZoneId;
            const color = getAQIColor(zone.currentAqi);

            return (
              <g
                key={zone.id}
                onClick={() => onSelectZone(zone.id)}
                className="cursor-pointer transition-transform duration-200"
                tabIndex={0}
                role="button"
                aria-label={`${zone.name}, AQI ${zone.currentAqi}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectZone(zone.id);
                }}
              >
                {/* Glow ring when selected */}
                {isSelected && (
                  <circle cx={pos.x} cy={pos.y} r="34" fill={color} fillOpacity="0.25" className="animate-pulse" />
                )}
                {/* Core node */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="22"
                  fill="#0f172a"
                  stroke={color}
                  strokeWidth={isSelected ? '3.5' : '2'}
                />
                {/* AQI text inside node */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {zone.currentAqi}
                </text>
                {/* Label below node */}
                <text
                  x={pos.x}
                  y={pos.y + 36}
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="10"
                  fontWeight="600"
                >
                  {zone.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Screen Reader Twin Table for Accessibility */}
        <div className="sr-only">
          <h4>Urban Sector Air Quality Status Table</h4>
          <table>
            <thead>
              <tr>
                <th>Zone</th>
                <th>AQI</th>
                <th>PM2.5</th>
                <th>Inversion Status</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z.id}>
                  <td>{z.name}</td>
                  <td>{z.currentAqi}</td>
                  <td>{z.pollutants.pm25} µg/m³</td>
                  <td>
                    {z.temperatureInversionCap > z.temperatureGround
                      ? 'Inversion Active (Cap +' + (z.temperatureInversionCap - z.temperatureGround).toFixed(1) + '°C)'
                      : 'Vertical Mixing Active'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

SmogHeatmap.displayName = 'SmogHeatmap';
