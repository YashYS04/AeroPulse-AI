// ============================================================
// server.ts
// Standalone Node.js server launcher for AeroPulse AI Gateway
// ============================================================

import dotenv from 'dotenv';
dotenv.config();

import { app } from './server/app.js';

export { app };

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🛡️ AeroPulse AI Gateway running on port ${PORT}`);
  });
}
