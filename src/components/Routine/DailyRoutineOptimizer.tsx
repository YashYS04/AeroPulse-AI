// ============================================================
// src/components/Routine/DailyRoutineOptimizer.tsx
// GenAI-Powered Low-Emission Daily Routine Scheduling Engine
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { VulnerabilityPersona, RoutineInsight } from '@/types/routine';
import { PERSONA_PROFILES } from '@/lib/constants/personas';
import { fetchRoutineInsights } from '@/services/apiService';
import { RoutineTimeline } from './RoutineTimeline';

export const DailyRoutineOptimizer: React.FC = React.memo(() => {
  const { state, dispatch } = useApp();
  const [insight, setInsight] = useState<RoutineInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const personaMeta = PERSONA_PROFILES[state.selectedPersona];

  const loadRoutine = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoutineInsights(state.selectedPersona, state.selectedZoneId);
      setInsight(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate GenAI routine.');
    } finally {
      setLoading(false);
    }
  }, [state.selectedPersona, state.selectedZoneId]);

  useEffect(() => {
    loadRoutine();
  }, [loadRoutine]);

  return (
    <section aria-labelledby="routine-heading" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 id="routine-heading" className="text-xl sm:text-2xl font-black text-white tracking-tight">
            GenAI Daily Routine & Exposure Optimizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Tailored hourly schedules shifting exposures away from nocturnal smog inversions
          </p>
        </div>
        <button
          type="button"
          onClick={loadRoutine}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-all focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          {loading ? 'Optimizing Schedule...' : '🔄 Re-Optimize with GenAI'}
        </button>
      </div>

      {/* Persona Selection Carousel/Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Select Vulnerability Persona Profile
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.values(VulnerabilityPersona).map((persona) => {
            const isSelected = state.selectedPersona === persona;
            return (
              <button
                key={persona}
                type="button"
                onClick={() => dispatch({ type: 'SELECT_PERSONA', payload: persona })}
                aria-pressed={isSelected}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <strong className="text-xs block font-bold leading-tight">{persona}</strong>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Threshold: {PERSONA_PROFILES[persona].criticalAqiThreshold} AQI
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error state */}
      {error && !insight && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button
            type="button"
            onClick={loadRoutine}
            className="px-3 py-1 bg-rose-700 hover:bg-rose-600 rounded-lg text-white font-bold text-xs"
          >
            Retry GenAI
          </button>
        </div>
      )}

      {/* Clinical Rationale & Metric Summary */}
      {insight && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs uppercase font-bold text-slate-400 block">Optimal Safe Outdoor Window</span>
            <strong className="text-base font-extrabold text-emerald-400 block mt-1">
              {insight.optimalOutdoorWindow}
            </strong>
            <span className="text-xs text-slate-400 mt-1 block">When solar heating clears surface inversion</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs uppercase font-bold text-slate-400 block">Projected Exposure Reduction</span>
            <strong className="text-3xl font-black text-white block mt-1">
              {insight.projectedExposureReductionPercent}%
            </strong>
            <span className="text-xs text-slate-400 block">Less alveolar particulate mass inhaled</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs uppercase font-bold text-slate-400 block">Clinical Protection Mask</span>
            <strong className="text-sm font-bold text-slate-200 block mt-1">
              {personaMeta.recommendedMask}
            </strong>
            <span className="text-xs text-slate-400 block mt-0.5">{personaMeta.description}</span>
          </div>
        </div>
      )}

      {/* Hour by hour timeline */}
      {insight && <RoutineTimeline hours={insight.hourByHour} />}

      {/* Sustainable Behavior Shifts */}
      {insight && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Recommended Sustainable Alternatives & Routine Shifts
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
            {insight.sustainableBehaviorAlternatives.map((alt, i) => (
              <li key={i} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{alt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
});

DailyRoutineOptimizer.displayName = 'DailyRoutineOptimizer';
