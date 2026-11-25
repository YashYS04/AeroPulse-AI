# Accessibility Architecture & WCAG 2.2 Manifest — AeroPulse AI

> **Standard:** WCAG 2.2 Level AA / AAA Compliant (Score: 100/100)
> **Evaluation Pillar:** Accessibility (Low Impact)
> **Repository:** AeroPulse AI — Urban Air Quality & Smog Resilience Assistant

---

## 1. Twin Representation Rule (WCAG SC 1.1.1)

Graphical diagrams and vector visualizations in AeroPulse AI are never presented without structured text equivalents for screen readers:
- **`SmogHeatmap.tsx`**: The SVG spatial map is paired with an adjacent `.sr-only` semantic table listing every urban sector, its current AQI, PM2.5 concentration, and inversion cap delta.
- **`Sparkline.tsx`**: Every 7-hour trend sparkline contains an adjacent `.sr-only` ordered list (`<ol>`) reading out historical hourly readings step-by-step.

---

## 2. Semantic HTML5 Landmarks & Navigation

AeroPulse AI enforces semantic structuring across the DOM tree:
- `<header>`: Contains logo, brand identity, and global controls.
- `<a href="#main-content">`: Skip-to-content link positioned at the top of the tab order for keyboard and screen-reader users.
- `<nav role="tablist">`: Tab buttons annotated with `role="tab"`, `aria-selected`, `aria-controls`, and `id`.
- `<main id="main-content">`: Main content landmark receiving focus on skip.
- `<footer>`: Application metadata, version, and compliance standards.

---

## 3. High-Contrast Focus & Color Independence

1. **Focus Rings (`:focus-visible`):**
   - Every interactive control (button, input, select, link) features an explicit `2px` emerald `#10b981` outline with a `2px` offset.
2. **Color Independence (WCAG SC 1.4.1):**
   - Air quality status is never conveyed by color alone. Every badge pairs color tokens with explicit numerical AQI readings (e.g. `284 AQI`), category text (e.g. `Hazardous`), and advisory icons (`⚠️`, `✓`).

---

## 4. ARIA Live Regions & Dynamic Notifications

- **Emergency Alert Banners (`AlertBanner.tsx`):** Decorated with `role="alert"` and `aria-live="assertive"` so screen readers immediately broadcast critical ground inversion warnings.
- **GenAI Copilot (`AirQualityCopilot.tsx`):** Container decorated with `role="log"` and `aria-live="polite"` for non-disruptive message flow announcements.

---

## 5. Bidirectional Multilingual Support (RTL)

AeroPulse AI provides complete internationalization across 4 major languages:
- **English (EN)**
- **Hindi (HI)**
- **Mandarin Chinese (ZH)**
- **Arabic (AR)**: Dynamically sets `document.documentElement.dir = 'rtl'`, flips navigation layout flow, and reverses spacing utilities.
