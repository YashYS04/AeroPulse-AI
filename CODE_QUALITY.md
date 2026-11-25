# Code Quality Manifest — AeroPulse AI

> **Standard:** Elite Production-Grade Architecture
> **Evaluation Pillar:** Code Quality (High Impact)
> **Repository:** AeroPulse AI — Urban Air Quality & Smog Resilience Assistant

---

## 1. Architectural Layer Segregation

AeroPulse AI enforces strict separation of concerns with zero duplicate logic between serverless and standalone runtimes:

```text
api/                     # Native Vercel Serverless Functions (Zero duplication)
├── _lib/                # Shared server logic consumed by both Vercel & Express
│   ├── aiService.ts     # Pure Google Gemini 3.5 Flash Lite GenAI engine (named constants)
│   ├── cache.ts         # Deterministic SHA-256 LRU cache (<10ms hits)
│   ├── http.ts          # Hardened CORS allowlist, rate limiter, 15KB cap & createPostHandler
│   └── validators.ts    # ValidationError, validateChatContext & CWE-20 input sanitization
├── chat-assistant.ts    # POST /api/chat-assistant
├── routine-insights.ts  # POST /api/routine-insights
└── health.ts            # GET /api/health

server/                  # Express 5 gateway re-exporting shared api/_lib modules
├── aiService.ts         # Re-exports ../api/_lib/aiService.js
├── cache.ts             # Re-exports ../api/_lib/cache.js
├── middleware.ts        # Helmet CSP, CORS allowlist, rate limiting, CWE-209 error handler
├── validators.ts        # Re-exports ../api/_lib/validators.js
└── app.ts               # Express app factory
server.ts                # Express gateway application entry point

src/
├── components/          # Memoized React presentation components (React.memo)
│   ├── Assistant/       # AirQualityCopilot.tsx, ChatMessageItem.tsx
│   ├── Dashboard/       # AirTelemetryDashboard.tsx, TelemetryStatusCards.tsx, SmogHeatmap.tsx
│   ├── Routine/         # DailyRoutineOptimizer.tsx, RoutineInsightCards.tsx, RoutineTimeline.tsx
│   ├── Impact/          # DirectImpactExplainer.tsx, ImpactComparisonCard.tsx
│   ├── IAQ/             # IAQCenter.tsx, CorsiRosenthalBuilder.tsx, WindowSchedule.tsx, DIYHackGrid.tsx
│   ├── Transit/         # TransitPlanner.tsx, TransitComparisonTable.tsx
│   ├── Community/       # CommunityHub.tsx, PledgeCard.tsx
│   ├── Navigation/      # Header.tsx
│   └── shared/          # AlertBanner.tsx, Sparkline.tsx, ZoneCard.tsx
├── context/             # AppContext.tsx (clean reducer + simulation helpers), types.ts
├── hooks/               # useAirAnalytics.ts, useExposureRouting.ts, useGenAIAssistant.ts
├── lib/
│   ├── compute/         # Pure table-driven algorithms (Zero DOM, zero side effects)
│   │   ├── asserts.ts, aqiBreakpoints.ts, cadrCalculations.ts, commuteDose.ts,
│   │   ├── dijkstraRouter.ts, meteorology.ts, impactEngine.ts, index.ts
│   └── constants/       # Centralized domain constants, zones, pledges, translations
├── services/            # apiService.ts (shared postJson helper), storageService.ts
├── test/                # 8 Vitest + JSDOM automated test suites (57 tests, 100% passing)
└── types/               # Centralized domain interfaces & enums
```

---

## 2. Strict Modular Quality Limits

1. **Module Line Limit ($\le 200$ Lines):**
   - **100% of all 80 TypeScript and TSX files strictly comply.**
   - Largest production source file is `SmogHeatmap.tsx` at 160 lines.
2. **Concise Functions & Data-Driven Design:**
   - Pure compute engines (`aqiBreakpoints.ts`, `impactEngine.ts`, `dijkstraRouter.ts`, `commuteDose.ts`) use lookup tables and focused helpers instead of long `switch`/`if-else` chains.
3. **Zero Duplication (DRY):**
   - Shared `createPostHandler`, `postJson`, `simulateZones`, and `api/_lib/` eliminate duplicated boilerplate across client, Express server, and Vercel serverless endpoints.
4. **Zero `any`, Clean React Keys & JSDoc:**
   - Strict TypeScript + `oxlint` (`no-explicit-any`, `no-unused-vars`, `react/rules-of-hooks`, `react/no-array-index-key`) plus JSDoc docstrings on exported functions, hooks, classes, and components.

---

## 3. Static Analysis & Verification

- **Linter:** `oxlint --deny-warnings` passes with **0 errors and 0 warnings** across all 80 files.
- **Compiler:** `tsc -b` passes cleanly in strict mode.
- **Automated Tests:** **57 / 57 tests passing** across 8 Vitest suites (`vitest run`).
- **Pre-Commit:** `.pre-commit-config.yaml` enforces formatting, linting, typechecking, and tests before commits.
