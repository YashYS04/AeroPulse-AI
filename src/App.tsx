// ============================================================
// src/App.tsx
// Root application layout with accessible landmarks & routing
// ============================================================

import React from 'react';
import { useApp } from '@/context/AppContext';
import { TabId } from '@/types';
import { Header } from '@/components/Navigation/Header';
import { AirTelemetryDashboard } from '@/components/Dashboard/AirTelemetryDashboard';
import { AirQualityCopilot } from '@/components/Assistant/AirQualityCopilot';
import { DailyRoutineOptimizer } from '@/components/Routine/DailyRoutineOptimizer';
import { DirectImpactExplainer } from '@/components/Impact/DirectImpactExplainer';
import { IAQCenter } from '@/components/IAQ/IAQCenter';
import { TransitPlanner } from '@/components/Transit/TransitPlanner';
import { CommunityHub } from '@/components/Community/CommunityHub';

export const App: React.FC = () => {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 outline-none"
      >
        <div
          role="tabpanel"
          id={`panel-${state.currentTab}`}
          aria-labelledby={`tab-${state.currentTab}`}
          className="focus-visible:outline-none"
        >
          {state.currentTab === TabId.Dashboard && <AirTelemetryDashboard />}
          {state.currentTab === TabId.Assistant && <AirQualityCopilot />}
          {state.currentTab === TabId.Routine && <DailyRoutineOptimizer />}
          {state.currentTab === TabId.Impact && <DirectImpactExplainer />}
          {state.currentTab === TabId.IAQ && <IAQCenter />}
          {state.currentTab === TabId.Transit && <TransitPlanner />}
          {state.currentTab === TabId.Community && <CommunityHub />}
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>AeroPulse AI v2.0 • Offline-First Smog Resilience Platform</span>
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>WCAG 2.2 AA Compliant</span>
            <span>•</span>
            <span>ASHRAE 4 ACH CADR Model</span>
            <span>•</span>
            <span>US-EPA AQI Interpolation</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
