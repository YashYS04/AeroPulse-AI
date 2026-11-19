// ============================================================
// src/context/types.ts
// State and action interfaces for global AppContext
// ============================================================

import {
  TabId,
  Language,
  AccessibilityMode,
  UrbanZone,
  VulnerabilityPersona,
  CommunityPledge,
  AssistantMessage,
  ChoiceImpactDetail,
} from '@/types';

export interface AppState {
  currentTab: TabId;
  language: Language;
  accessibilityMode: AccessibilityMode;
  zones: UrbanZone[];
  selectedZoneId: string;
  selectedPersona: VulnerabilityPersona;
  pledges: CommunityPledge[];
  chatHistory: AssistantMessage[];
  selectedChoices: ChoiceImpactDetail[];
  isSmogSimulated: boolean;
  isClearingSimulated: boolean;
}

export type AppAction =
  | { type: 'SET_TAB'; payload: TabId }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_ACCESSIBILITY_MODE'; payload: AccessibilityMode }
  | { type: 'SELECT_ZONE'; payload: string }
  | { type: 'SELECT_PERSONA'; payload: VulnerabilityPersona }
  | { type: 'TOGGLE_PLEDGE'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: AssistantMessage }
  | { type: 'TOGGLE_CHOICE'; payload: ChoiceImpactDetail }
  | { type: 'TRIGGER_SMOG_SPIKE' }
  | { type: 'TRIGGER_SOLAR_CLEAN' }
  | { type: 'RESET_TELEMETRY' };
