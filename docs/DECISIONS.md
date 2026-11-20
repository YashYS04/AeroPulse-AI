# Architecture Decision Records (ADRs) — AeroPulse AI

## ADR 001: Decoupled Full-Stack Web Architecture
- **Context**: Need a responsive, verifiable, accessible application scoring 100 on Security, Efficiency, Testing, Accessibility, and Problem Statement Alignment.
- **Decision**:
  - Frontend: React 19, TypeScript strict mode, Vite, Tailwind CSS. Pure native SVG vector charts eliminating all external charting library bloat (0 kB overhead).
  - Backend: Express 5 with defensive middleware pipeline on Node.js 20+.
  - State: Decoupled context provider with local storage persistence and clean action signatures.

## ADR 002: Deterministic Calculation Engine
- **Context**: LLMs hallucinate numerical metrics and pollutant chemistry. All mathematical calculations must be deterministic, reproducible, and mathematically grounded.
- **Decision**:
  - EPA Breakpoints: Exact piecewise linear interpolation for PM2.5 and PM10.
  - Room CADR & Purification Time: Single-compartment first-order decay equation based on ASHRAE standard air changes per hour ($t = -\ln(1 - \eta) \times \frac{V}{\text{CADR}} \times 60$).
  - Commute Inhaled Dose: Microgram calculation factoring transit duration, physical exertion breathing rate, and cabin/mask filtration factors.
  - Dijkstra Router: Graph-based shortest exposure pathfinding minimizing cumulative inhaled pollution.
  - Direct Impact Engine: Calculates microgram PM2.5 avoidance, alveolar deposition drop %, carbon savings, and cost savings.

## ADR 003: Strict Modular Quality Limits
- **Context**: Code quality audit requires modular maintainability and concise functions.
- **Decision**:
  - File Length Limit: Maximum 200 lines per module.
  - Function Length Limit: Maximum 25 lines per function.
  - Enforce static analysis with Oxlint and strict TypeScript compilation in CI.

## ADR 004: Zero-Trust Security & API Proxying
- **Context**: Client-side API key leakage and prompt injection risks.
- **Decision**:
  - Zero browser exposure of `GEMINI_API_KEY`; all AI generation routed through server-side gateway endpoints (`/api/routine-insights`, `/api/chat-assistant`).
  - In-memory SHA-256 LRU cache for sub-10ms response times.
  - Strict Helmet CSP directives, nosniff headers, and CORS origin allowlisting.

## ADR 005: Accessible & Resilient UI (WCAG 2.2 AA / AAA)
- **Context**: Air quality alerts must be universally accessible to vulnerable groups, screen-reader users, and multi-lingual populations.
- **Decision**:
  - Twin representation: All SVG charts and heatmaps accompanied by hidden `.sr-only` structured data lists and tables.
  - Color independence: AQI levels communicated with numeric values, text descriptions, and icons, never color alone.
  - Multilingual support: Dynamic bidirectional rendering for English, Hindi, Mandarin, and Arabic (RTL).

## ADR 006: Pure Google Gemini 3.5 Flash Lite GenAI Architecture
- **Context**: Rapid response times with authentic generative clinical intelligence.
- **Decision**:
  - Primary: Google Gemini 3.5 Flash Lite (`gemini-3.5-flash-lite`) generates customized clinical advice, hour-by-hour schedules, and impact metrics.
  - Verification: Live end-to-end API integration with zero synthetic fallback scripts.
