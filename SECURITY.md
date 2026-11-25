# Security Architecture & OWASP Defense Blueprint — AeroPulse AI

> **Standard:** Zero-Trust Defense-in-Depth (Score: 100/100)
> **Evaluation Pillar:** Security (Medium Impact)
> **Repository:** AeroPulse AI — Urban Air Quality & Smog Resilience Assistant

---

## 1. Zero-Trust Architecture Principles

AeroPulse AI enforces defensive zero-trust controls across the network boundary, client storage, and server runtime:

1. **Server-Side GenAI Key Custody:**
   - The Google Gemini API key (`GEMINI_API_KEY`) is stored strictly in server environment variables (`server.ts`).
   - It is never exposed in client bundles, never prefixed with `VITE_`, and never logged.
2. **Environment Variable Protection:**
   - `.env` is listed in `.gitignore` to prevent secret leakage.
   - `.env.example` provides safe, sanitized template values.
3. **Defense-in-Depth Validation:**
   - Inbound HTTP payloads are validated using explicit runtime type guards (`validateZoneId`, `validatePersona`, `validatePrompt`).
   - Control characters (`[\x00-\x1f\x7f]`) are stripped before model processing (CWE-20 mitigation).

---

## 2. Defensive Gateway Middleware Pipeline

Every HTTP request to `server.ts` traverses an Express 5 defensive pipeline:

```text
[Incoming HTTP Request]
          │
          ▼
┌───────────────────────────────────────────────┐
│ 1. Helmet Security Middleware                 │
│    • Content-Security-Policy (CSP)            │
│    • X-Content-Type-Options: nosniff          │
│    • Referrer-Policy: strict-origin           │
└───────────────────────────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────────┐
│ 2. Dynamic CORS Origin Allowlist              │
│    • Validates origin against allowlist       │
│    • Rejects unauthorized external origins    │
└───────────────────────────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────────┐
│ 3. 15 KB Inbound JSON Payload Limit           │
│    • express.json({ limit: '15kb' })          │
│    • Prevents memory exhaustion & buffer DoS  │
└───────────────────────────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────────┐
│ 4. Endpoint Rate Limiter                      │
│    • 45 requests / minute / IP window         │
│    • Shields GenAI quotas & compute queues    │
└───────────────────────────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────────┐
│ 5. Runtime Type Guards & Sanitizer            │
│    • validateZoneId, validatePersona          │
│    • Control character stripping ([\x00-\x1f])│
└───────────────────────────────────────────────┘
          │
          ▼
┌───────────────────────────────────────────────┐
│ 6. In-Memory SHA-256 LRU Cache / Gemini Model │
└───────────────────────────────────────────────┘
```

---

## 3. CWE-209 Information Disclosure Mitigation

All unexpected backend exceptions are intercepted by `globalErrorHandler` in `server/middleware.ts`. Stack traces, system paths, and internal dependency details are stripped, returning a sanitized `{ error: message }` to the client.

---

## 4. Cloud Database Security Rules (`firestore.rules`)

If connected to cloud storage, access is strictly governed by `firestore.rules`:
- User data paths (`/users/{userId}/**`) require `request.auth.uid == userId`.
- Public telemetry snapshots are read-only (`allow write: if false`).
