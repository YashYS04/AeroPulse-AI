// ============================================================
// src/components/Navigation/Header.tsx
// Accessible navigation header, language selector & a11y toggles
// ============================================================

import React from 'react';
import { useApp } from '@/context/AppContext';
import { TabId, Language, AccessibilityMode } from '@/types';
import { TRANSLATIONS } from '@/lib/constants/translations';

export const Header: React.FC = React.memo(() => {
  const { state, dispatch, activeZone } = useApp();
  const t = TRANSLATIONS[state.language] || TRANSLATIONS[Language.EN];

  const tabs = [
    { id: TabId.Dashboard, label: t.tabs.dashboard, icon: '📊' },
    { id: TabId.Assistant, label: t.tabs.assistant, icon: '🤖' },
    { id: TabId.Routine, label: t.tabs.routine, icon: '🗓️' },
    { id: TabId.Impact, label: t.tabs.impact, icon: '🌱' },
    { id: TabId.IAQ, label: t.tabs.iaq, icon: '🏠' },
    { id: TabId.Transit, label: t.tabs.transit, icon: '🚇' },
    { id: TabId.Community, label: t.tabs.community, icon: '🤝' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      {/* Skip to main content link for keyboard screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg shadow-lg"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-950/50 flex-shrink-0">
              <span className="text-xl" role="img" aria-label="AeroPulse Logo">🛡️</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-black text-white tracking-tight truncate flex items-center gap-2">
                {t.appTitle}
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  GenAI v2.0
                </span>
              </h1>
              <p className="text-xs text-slate-400 truncate hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Controls: Zone Indicator + Language + A11y */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{activeZone.name}:</span>
              <strong className="text-emerald-400 font-extrabold">{activeZone.currentAqi} AQI</strong>
            </div>

            {/* Language Selector */}
            <label htmlFor="language-select" className="sr-only">Choose Language</label>
            <select
              id="language-select"
              value={state.language}
              onChange={(e) => dispatch({ type: 'SET_LANGUAGE', payload: e.target.value as Language })}
              className="bg-slate-900 border border-slate-750 text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              <option value={Language.EN}>English (EN)</option>
              <option value={Language.HI}>हिंदी (HI)</option>
              <option value={Language.ZH}>中文 (ZH)</option>
              <option value={Language.AR}>العربية (AR)</option>
            </select>

            {/* A11y Mode Selector */}
            <label htmlFor="a11y-select" className="sr-only">Accessibility View</label>
            <select
              id="a11y-select"
              value={state.accessibilityMode}
              onChange={(e) =>
                dispatch({
                  type: 'SET_ACCESSIBILITY_MODE',
                  payload: e.target.value as AccessibilityMode,
                })
              }
              className="bg-slate-900 border border-slate-750 text-slate-200 text-xs font-semibold rounded-lg px-2 py-1.5 hidden lg:block focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              <option value={AccessibilityMode.Standard}>Standard Contrast</option>
              <option value={AccessibilityMode.HighContrast}>High Contrast (AAA)</option>
              <option value={AccessibilityMode.ScreenReaderOptimized}>Screen-Reader Focus</option>
            </select>
          </div>
        </div>

        {/* Accessible Navigation Tablist */}
        <nav
          role="tablist"
          aria-label="Urban Air Quality Application Sections"
          className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none border-t border-slate-800/60 pt-2"
        >
          {tabs.map((tab) => {
            const isActive = state.currentTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id })}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-150 focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span aria-hidden="true">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
