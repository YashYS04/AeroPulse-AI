// ============================================================
// src/components/IAQ/IAQCenter.tsx
// Indoor Air Quality (IAQ) & Low-Cost Hack Center
// ============================================================

import React from 'react';
import { CorsiRosenthalBuilder } from './CorsiRosenthalBuilder';
import { WindowSchedule } from './WindowSchedule';
import { DIYHackGrid } from './DIYHackGrid';

export const IAQCenter: React.FC = React.memo(() => {
  return (
    <section aria-labelledby="iaq-heading" className="space-y-6">
      <div>
        <h2 id="iaq-heading" className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Indoor Air Quality (IAQ) & Low-Cost DIY Hack Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Room-by-room CADR clearance optimization, DIY Corsi-Rosenthal blueprints, and inversion ventilation schedules
        </p>
      </div>

      {/* CADR Calculator */}
      <CorsiRosenthalBuilder />

      {/* Window Ventilation Schedule */}
      <WindowSchedule />

      {/* DIY Air Hacks Grid */}
      <DIYHackGrid />
    </section>
  );
});

IAQCenter.displayName = 'IAQCenter';
