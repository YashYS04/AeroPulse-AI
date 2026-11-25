// ============================================================
// src/components/Routine/RoutineInsightCards.tsx
// Renders GenAI safe window metrics, mask advice, and alternatives
// ============================================================

import React from 'react';
import { RoutineInsight } from '@/types/routine';
import { PersonaMetadata } from '@/lib/constants/personas';
import { RoutineTimeline } from './RoutineTimeline';

interface RoutineInsightCardsProps {
  insight: RoutineInsight;
  personaMeta: PersonaMetadata;
}

/** Displays GenAI-generated outdoor convection windows, exposure reduction stats, and timeline. */
export const RoutineInsightCards: React.FC<RoutineInsightCardsProps> = React.memo(({
  insight,
  personaMeta,
}) => (
  <>
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

    <RoutineTimeline hours={insight.hourByHour} />

    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
        Recommended Sustainable Alternatives & Routine Shifts
      </h4>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
        {insight.sustainableBehaviorAlternatives.map((alt) => (
          <li key={alt} className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
            <span className="text-emerald-400 font-bold">✓</span>
            <span>{alt}</span>
          </li>
        ))}
      </ul>
    </div>
  </>
));

RoutineInsightCards.displayName = 'RoutineInsightCards';
