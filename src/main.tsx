// ============================================================
// src/main.tsx
// Application entry point with React 19 createRoot
// ============================================================

import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '@/context/AppContext';
import App from '@/App';
import '@/index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root HTML element "#root" not found in document.');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
