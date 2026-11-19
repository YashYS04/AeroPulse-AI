// ============================================================
// src/components/Impact/DirectImpactExplainer.tsx
// Quantified Direct Impact Explainer: Health, Carbon & Cost
// ============================================================

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { calculateChoiceImpact, aggregateDirectImpacts } from '@/lib/compute/impactEngine';
import { ImpactComparisonCard } from './ImpactComparisonCard';

export const DirectImpactExplainer: React.FC = React.memo(() => {
  const { state, dispatch, activeZone } = useApp();

  const allAvailableChoices = useMemo(() => {
    return [
      calculateChoiceImpact('diy-corsi-box', activeZone.pollutants.pm25),
      calculateChoiceImpact('subway-vs-diesel', activeZone.pollutants.pm25),
      calculateChoiceImpact('inversion-window-discipline', activeZone.pollutants.pm25),
      calculateChoiceImpact('default', activeZone.pollutants.pm25),
    ];
  }, [activeZone.pollutants.pm25]);

  const summary = useMemo(() => {
    return aggregateDirectImpacts(state.selectedChoices);
  }, [state.selectedChoices]);

  return (
    <section aria-labelledby="impact-heading" className="space-y-6">
      <div>
        <h2 id="impact-heading" className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Direct Impact Engine: Explaining Every Lifestyle Choice
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Quantifying exact inhaled particulate avoidance, deep lung tissue protection, and carbon offset
        </p>
      </div>

      {/* Aggregate Impact Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow">
          <span className="text-xs uppercase font-bold text-slate-400 block">Total PM2.5 Inhalation Avoided</span>
          <strong className="text-2xl sm:text-3xl font-black text-emerald-400 block mt-1">
            {summary.totalPm25AvertedUg} µg
          </strong>
          <span className="text-[11px] text-slate-400 mt-1 block">Averted deep pulmonary mass</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow">
          <span className="text-xs uppercase font-bold text-slate-400 block">Average Alveolar Relief</span>
          <strong className="text-2xl sm:text-3xl font-black text-blue-400 block mt-1">
            -{summary.respiratoryBurdenReliefPercent}%
          </strong>
          <span className="text-[11px] text-slate-400 mt-1 block">Lower inflammation risk</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow">
          <span className="text-xs uppercase font-bold text-slate-400 block">Carbon Footprint Saved</span>
          <strong className="text-2xl sm:text-3xl font-black text-teal-400 block mt-1">
            {summary.totalCo2SavedKg} kg
          </strong>
          <span className="text-[11px] text-slate-400 mt-1 block">CO₂ equivalent emissions</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow">
          <span className="text-xs uppercase font-bold text-slate-400 block">Estimated Family Savings</span>
          <strong className="text-2xl sm:text-3xl font-black text-amber-300 block mt-1">
            ${summary.totalCostSaved}
          </strong>
          <span className="text-[11px] text-slate-400 mt-1 block">vs expensive commercial alternatives</span>
        </div>
      </div>

      {/* Interactive Choice Comparison List */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">
          Adoptable Lifestyle & Sustainable Choices ({summary.activeChoicesCount} Active)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allAvailableChoices.map((choice) => {
            const isActive = state.selectedChoices.some((c) => c.title === choice.title);
            return (
              <ImpactComparisonCard
                key={choice.title}
                choice={choice}
                isActive={isActive}
                onToggle={(c) => dispatch({ type: 'TOGGLE_CHOICE', payload: c })}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
});

DirectImpactExplainer.displayName = 'DirectImpactExplainer';
