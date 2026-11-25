// ============================================================
// src/components/Community/PledgeCard.tsx
// Neighborhood collective emission reduction pledge card
// ============================================================

import React from 'react';
import { CommunityPledge } from '@/types/community';

interface PledgeCardProps {
  pledge: CommunityPledge;
  onToggle: (pledgeId: string) => void;
}

export const PledgeCard: React.FC<PledgeCardProps> = React.memo(({ pledge, onToggle }) => {
  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
        pledge.isUserJoined
          ? 'bg-slate-900/90 border-emerald-500 shadow-md shadow-emerald-950/30 ring-1 ring-emerald-500/40'
          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {pledge.category}
          </span>
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <span>👥</span> {pledge.activePledgersCount + (pledge.isUserJoined ? 1 : 0)} joined
          </span>
        </div>

        <h4 className="text-base font-bold text-white tracking-tight mb-1.5">{pledge.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">{pledge.description}</p>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center mb-3">
          <div>
            <span className="text-[10px] text-slate-400 block">CO₂ Saved / Day</span>
            <strong className="text-xs font-black text-emerald-400">
              {pledge.dailyCo2AvoidedKg} kg
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">PM2.5 Averted / Day</span>
            <strong className="text-xs font-black text-teal-300">
              {pledge.dailyPm25AvoidedGrams} g
            </strong>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggle(pledge.id)}
          aria-pressed={pledge.isUserJoined}
          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-emerald-400 ${
            pledge.isUserJoined
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
        >
          {pledge.isUserJoined ? '✓ Pledged with Community' : '+ Join Neighborhood Pledge'}
        </button>
      </div>
    </div>
  );
});

PledgeCard.displayName = 'PledgeCard';
