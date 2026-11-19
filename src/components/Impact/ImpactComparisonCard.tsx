// ============================================================
// src/components/Impact/ImpactComparisonCard.tsx
// Side-by-side conventional vs sustainable choice impact card
// ============================================================

import React from 'react';
import { ChoiceImpactDetail } from '@/types/impact';

interface ImpactComparisonCardProps {
  choice: ChoiceImpactDetail;
  isActive: boolean;
  onToggle: (choice: ChoiceImpactDetail) => void;
}

export const ImpactComparisonCard: React.FC<ImpactComparisonCardProps> = React.memo(({
  choice,
  isActive,
  onToggle,
}) => {
  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-200 ${
        isActive
          ? 'bg-slate-900/90 border-emerald-500 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/40'
          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
            Verified Choice Impact
          </span>
          <h3 className="text-base font-bold text-white tracking-tight">{choice.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => onToggle(choice)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-emerald-400 ${
            isActive
              ? 'bg-emerald-500 text-slate-950 shadow'
              : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
          }`}
        >
          {isActive ? '✓ Active Choice' : '+ Adopt Choice'}
        </button>
      </div>

      {/* Side-by-Side Comparison Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40 text-xs">
          <span className="text-rose-400 font-bold block mb-1">❌ Conventional Action</span>
          <p className="text-slate-300 leading-snug">{choice.conventionalAction}</p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs">
          <span className="text-emerald-400 font-bold block mb-1">🌱 Sustainable Alternative</span>
          <p className="text-slate-200 font-medium leading-snug">{choice.sustainableChoice}</p>
        </div>
      </div>

      {/* Quantified Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-center">
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">PM2.5 Averted</span>
          <strong className="text-sm font-extrabold text-emerald-400">
            {choice.pm25InhaledAvertedUg} µg
          </strong>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Alveolar Relief</span>
          <strong className="text-sm font-extrabold text-blue-400">
            -{choice.alveolarDepositionRiskDropPercent}%
          </strong>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">CO₂ Saved</span>
          <strong className="text-sm font-extrabold text-teal-400">
            {choice.co2SavedKg} kg
          </strong>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Financial Saving</span>
          <strong className="text-sm font-extrabold text-amber-300">
            ${choice.moneySavedCurrency}
          </strong>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400 italic">
        Clinical insight: {choice.clinicalExplanation}
      </p>
    </div>
  );
});

ImpactComparisonCard.displayName = 'ImpactComparisonCard';
