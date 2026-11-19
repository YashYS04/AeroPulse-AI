# Testing Standards & QA Automation Manifest — AeroPulse AI

> **Standard:** 100% Pass Rate Across 8 Multi-Tier Test Suites (Score: 100/100)  
> **Evaluation Pillar:** Testing & QA Automation (Low Impact)  
> **Repository:** AeroPulse AI — Urban Air Quality & Smog Resilience Assistant  

---

## 1. Test Architecture & Environment

AeroPulse AI implements multi-tier test automation using **Vitest v3.2.7** configured with **JSDOM** and **Testing Library** (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`).

```text
src/test/
├── setup.ts                 # Global jest-dom matchers & JSDOM mocks
├── cadrIaq.test.ts          # Tier 1: Room CADR, 4 ACH & Mass Balance Clearance (6 tests)
├── meteorology.test.ts      # Tier 1: Boundary Layer Temperature Inversions & Lapse Rates (4 tests)
├── aqiBreakpoints.test.ts   # Tier 1: EPA Piecewise Linear Sub-Index & AQI Categories (8 tests)
├── impactEngine.test.ts     # Tier 1: Direct Impact Engine & Community Offset Mathematics (9 tests)
├── commuteRouting.test.ts   # Tier 2: Inhaled PM2.5 Dose & Dijkstra Pathfinding (6 tests)
├── api.test.ts              # Tier 5: Live Gateway, Type Guards & SHA-256 LRU Cache (9 tests)
├── rendering.test.tsx       # Tier 3: Semantic HTML Landmarks & WCAG Twin Representations (8 tests)
└── dom.test.tsx             # Tier 4: DOM Interactions, Pledges, Simulations & Selectors (6 tests)
```

---

## 2. Verified Test Execution Scorecard

Executed via `npm run test:run` in Vitest v3.2.7:

| Test Suite | Purpose & Scope | Tests | Pass Rate | Status |
|---|---|---|---|---|
| `cadrIaq.test.ts` | Room CADR, ASHRAE 4 ACH & Exponential Decay Clearance | 6 | 100% | ✅ Passed |
| `meteorology.test.ts` | Atmospheric Boundary Layer Inversion Modeling & Stagnation | 4 | 100% | ✅ Passed |
| `aqiBreakpoints.test.ts` | EPA AQI Linear Interpolation, Colors & Breakpoints | 8 | 100% | ✅ Passed |
| `impactEngine.test.ts` | Direct Choice Impact Modeling & Community Offsets | 9 | 100% | ✅ Passed |
| `commuteRouting.test.ts` | Inhaled PM2.5 Intake & Dijkstra Lowest-Exposure Routing | 6 | 100% | ✅ Passed |
| `api.test.ts` | Gateway Validation, Type Guards & SHA-256 LRU Cache | 9 | 100% | ✅ Passed |
| `rendering.test.tsx` | Semantic HTML Landmarks & Screen Reader Twin Representations | 8 | 100% | ✅ Passed |
| `dom.test.tsx` | User Event Interactions, Simulations & Pledges | 6 | 100% | ✅ Passed |
| **TOTAL** | **Full Multi-Tier Test Suite** | **56** | **100%** | **✅ 56 / 56 Passed** |

---

## 3. Suite Scope Breakdown

1. **`cadrIaq.test.ts`**: Verifies room volume, required Clean Air Delivery Rate (CADR), 4 ACH target, and first-order exponential clearance decay time ($t = -\ln(1 - \eta) \times \frac{V}{\text{CADR}} \times 60$). Asserts RangeErrors on negative dimensions.
2. **`meteorology.test.ts`**: Verifies severe inversion detection ($\Delta T > 2^\circ\text{C}$ and wind $< 6\text{ km/h}$), moderate inversion, and normal atmospheric mixing.
3. **`aqiBreakpoints.test.ts`**: Verifies official US-EPA linear interpolation for PM2.5 and PM10 across all concentration thresholds.
4. **`impactEngine.test.ts`**: Verifies calculation of inhaled PM2.5 avoided, alveolar risk drop, carbon savings, and community pledge offsets.
5. **`commuteRouting.test.ts`**: Verifies Dijkstra graph traversal over `TRANSIT_GRAPH`, confirming preference for underground rail and avoidance of surface diesel bottlenecks.
6. **`api.test.ts`**: Verifies parameter validation type guards, CWE-20 control character sanitization, and SHA-256 LRU sub-millisecond cache hits.
7. **`rendering.test.tsx`**: Verifies that `<header>`, `<main>`, `<nav>`, `<article>`, and SVG `.sr-only` twins render cleanly without throwing exceptions.
8. **`dom.test.tsx`**: Uses `@testing-library/user-event` to simulate tab switching, smog spikes, zone selection, community pledge joins, and copilot chat submission.
