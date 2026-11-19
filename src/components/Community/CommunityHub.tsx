// ============================================================
// src/components/Community/CommunityHub.tsx
// Collective Neighborhood Action, Offsets & Multilingual Advisories
// ============================================================

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { calculateCommunityOffset } from '@/lib/compute/impactEngine';
import { INITIAL_COMMUNITY_ALERTS } from '@/lib/constants/community';
import { AlertBanner } from '../shared/AlertBanner';
import { PledgeCard } from './PledgeCard';

export const CommunityHub: React.FC = React.memo(() => {
  const { state, dispatch } = useApp();

  const offsets = useMemo(() => {
    return calculateCommunityOffset(state.pledges);
  }, [state.pledges]);

  return (
    <section aria-labelledby="community-heading" className="space-y-6">
      <div>
        <h2 id="community-heading" className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Community Hub & Collective Smog Action
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Neighborhood pledges, localized emergency advisories, and collective emission savings
        </p>
      </div>

      {/* Emergency Advisories / Alerts */}
      <div className="space-y-3">
        {INITIAL_COMMUNITY_ALERTS.map((alert) => (
          <AlertBanner
            key={alert.id}
            title={alert.title}
            message={alert.message}
            severity={alert.severity}
          />
        ))}
      </div>

      {/* Collective Emissions Ticker */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-teal-950/70 border border-emerald-500/40 shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
          Neighborhood Collective Impact Ticker
        </span>
        <h3 className="text-lg font-bold text-white mb-4">
          Community Emissions Prevented Today Across 5 Sectors
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs text-slate-400 block">Collective CO₂ Prevented</span>
            <strong className="text-3xl font-black text-emerald-400 block mt-1">
              {offsets.totalCo2AvoidedKg.toLocaleString()} kg
            </strong>
            <span className="text-[11px] text-slate-400">Through metro transit & clean heating</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-xs text-slate-400 block">Fine PM2.5 Prevented From Air</span>
            <strong className="text-3xl font-black text-teal-300 block mt-1">
              {(offsets.totalPm25AvoidedGrams / 1000).toFixed(2)} kg
            </strong>
            <span className="text-[11px] text-slate-400">Zero open burning & road dust mitigation</span>
          </div>
        </div>
      </div>

      {/* Pledges List */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
          Neighborhood Collective Pledges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {state.pledges.map((pledge) => (
            <PledgeCard
              key={pledge.id}
              pledge={pledge}
              onToggle={(id) => dispatch({ type: 'TOGGLE_PLEDGE', payload: id })}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

CommunityHub.displayName = 'CommunityHub';
