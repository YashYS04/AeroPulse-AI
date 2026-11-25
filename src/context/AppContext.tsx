// ============================================================
// src/context/AppContext.tsx
// Core reactive context managing global application state
// ============================================================

import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import {
  TabId,
  Language,
  AccessibilityMode,
  VulnerabilityPersona,
  UrbanZone,
} from '@/types';
import { INITIAL_URBAN_ZONES } from '@/lib/constants/zones';
import { INITIAL_COMMUNITY_PLEDGES } from '@/lib/constants/community';
import { calculateChoiceImpact } from '@/lib/compute/impactEngine';
import { safeStorageGet, safeStorageSet } from '@/services/storageService';
import { AppState, AppAction } from './types';

const INITIAL_STATE: AppState = {
  currentTab: TabId.Dashboard,
  language: safeStorageGet<Language>('aeropulse_lang', Language.EN),
  accessibilityMode: safeStorageGet<AccessibilityMode>('aeropulse_a11y', AccessibilityMode.Standard),
  zones: INITIAL_URBAN_ZONES,
  selectedZoneId: 'zone-cbd',
  selectedPersona: VulnerabilityPersona.AsthmaticChild,
  pledges: INITIAL_COMMUNITY_PLEDGES,
  chatHistory: [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content: 'Welcome to AeroPulse AI. I am your Urban Air Quality & Smog Resilience Copilot. How can I help protect your family from winter smog today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPromptFollowups: [
        'Is it safe for my child to play outdoors this afternoon?',
        'How do I build a Corsi-Rosenthal box under $50?',
        'What is the cleanest commute route from CBD to Suburbs?',
      ],
    },
  ],
  selectedChoices: [
    calculateChoiceImpact('diy-corsi-box', 148.5),
    calculateChoiceImpact('inversion-window-discipline', 148.5),
  ],
  isSmogSimulated: false,
  isClearingSimulated: false,
};

function simulateZones(zones: UrbanZone[], isSpike: boolean): UrbanZone[] {
  const aqiScale = isSpike ? 1.45 : 0.45;
  const pm25Scale = isSpike ? 1.55 : 0.42;
  const capOffset = isSpike ? 5.5 : -1.2;
  const windSpeedKmh = isSpike ? 2.1 : 12.4;

  return zones.map((z) => ({
    ...z,
    currentAqi: isSpike
      ? Math.min(500, Math.round(z.currentAqi * aqiScale))
      : Math.max(35, Math.round(z.currentAqi * aqiScale)),
    pollutants: {
      ...z.pollutants,
      pm25: Math.round(z.pollutants.pm25 * pm25Scale * 10) / 10,
    },
    temperatureInversionCap: z.temperatureGround + capOffset,
    windSpeedKmh,
  }));
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, currentTab: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_ACCESSIBILITY_MODE':
      return { ...state, accessibilityMode: action.payload };
    case 'SELECT_ZONE':
      return { ...state, selectedZoneId: action.payload };
    case 'SELECT_PERSONA':
      return { ...state, selectedPersona: action.payload };
    case 'TOGGLE_PLEDGE':
      return {
        ...state,
        pledges: state.pledges.map((p) =>
          p.id === action.payload ? { ...p, isUserJoined: !p.isUserJoined } : p
        ),
      };
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case 'TOGGLE_CHOICE': {
      const exists = state.selectedChoices.some((c) => c.title === action.payload.title);
      return {
        ...state,
        selectedChoices: exists
          ? state.selectedChoices.filter((c) => c.title !== action.payload.title)
          : [...state.selectedChoices, action.payload],
      };
    }
    case 'TRIGGER_SMOG_SPIKE':
      return { ...state, isSmogSimulated: true, isClearingSimulated: false, zones: simulateZones(state.zones, true) };
    case 'TRIGGER_SOLAR_CLEAN':
      return { ...state, isSmogSimulated: false, isClearingSimulated: true, zones: simulateZones(state.zones, false) };
    case 'RESET_TELEMETRY':
      return { ...state, zones: INITIAL_URBAN_ZONES, isSmogSimulated: false, isClearingSimulated: false };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  activeZone: UrbanZone;
}

const AppContext = createContext<AppContextValue | null>(null);

/** Provides global telemetry, persona, chat, and accessibility state to the application tree. */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);

  useEffect(() => {
    safeStorageSet('aeropulse_lang', state.language);
    document.documentElement.dir = state.language === Language.AR ? 'rtl' : 'ltr';
    document.documentElement.lang = state.language;
  }, [state.language]);

  useEffect(() => {
    safeStorageSet('aeropulse_a11y', state.accessibilityMode);
  }, [state.accessibilityMode]);

  const activeZone = useMemo(
    () => state.zones.find((z) => z.id === state.selectedZoneId) || state.zones[0],
    [state.zones, state.selectedZoneId]
  );

  const value = useMemo(() => ({ state, dispatch, activeZone }), [state, activeZone]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/** Hook to access AeroPulse global state, dispatcher, and active urban zone. */
export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
