// ============================================================
// src/types/index.ts
// Centralized re-export barrel for all domain models
// ============================================================

export * from './telemetry';
export * from './routine';
export * from './assistant';
export * from './impact';
export * from './transit';
export * from './iaq';
export * from './community';

export enum TabId {
  Dashboard = 'dashboard',
  Assistant = 'assistant',
  Routine = 'routine',
  Impact = 'impact',
  IAQ = 'iaq',
  Transit = 'transit',
  Community = 'community',
}

export enum Language {
  EN = 'en',
  HI = 'hi',
  ZH = 'zh',
  AR = 'ar',
}

export enum AccessibilityMode {
  Standard = 'standard',
  HighContrast = 'high-contrast',
  ScreenReaderOptimized = 'screen-reader',
}
