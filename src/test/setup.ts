// ============================================================
// src/test/setup.ts
// Vitest setup extending Jest-DOM matchers & JSDOM mocks
// ============================================================

import '@testing-library/jest-dom/vitest';

process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'test-mock-gemini-key';

if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
