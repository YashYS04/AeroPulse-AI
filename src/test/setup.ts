// ============================================================
// src/test/setup.ts
// Vitest setup extending Jest-DOM matchers & JSDOM mocks
// ============================================================

import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined') {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
