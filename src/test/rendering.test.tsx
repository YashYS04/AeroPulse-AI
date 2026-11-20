// ============================================================
// src/test/rendering.test.tsx
// Accessibility landmarks & component rendering verification
// ============================================================

import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { AppProvider } from '@/context/AppContext';
import App from '@/App';
import { AirTelemetryDashboard } from '@/components/Dashboard/AirTelemetryDashboard';
import { AirQualityCopilot } from '@/components/Assistant/AirQualityCopilot';
import { DailyRoutineOptimizer } from '@/components/Routine/DailyRoutineOptimizer';
import { DirectImpactExplainer } from '@/components/Impact/DirectImpactExplainer';
import { IAQCenter } from '@/components/IAQ/IAQCenter';
import { TransitPlanner } from '@/components/Transit/TransitPlanner';
import { CommunityHub } from '@/components/Community/CommunityHub';

function renderWithContext(ui: React.ReactElement) {
  return render(<AppProvider>{ui}</AppProvider>);
}

describe('Component Landmarks & Accessibility Rendering', () => {
  it('renders App shell with semantic landmarks (header, main, footer)', () => {
    renderWithContext(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders AirTelemetryDashboard with native SVG heatmap and twins', () => {
    renderWithContext(<AirTelemetryDashboard />);
    expect(screen.getByRole('img', { name: /urban spatial smog telemetry heatmap/i })).toBeInTheDocument();
    expect(screen.getByText(/atmospheric boundary layer model/i)).toBeInTheDocument();
  });

  it('renders AirQualityCopilot with prompt form and context badges', () => {
    renderWithContext(<AirQualityCopilot />);
    expect(screen.getByPlaceholderText(/ask about routines, hacks/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('renders DailyRoutineOptimizer with persona profiles', async () => {
    await act(async () => {
      renderWithContext(<DailyRoutineOptimizer />);
    });
    expect(screen.getByText(/asthmatic child/i)).toBeInTheDocument();
    expect(screen.getByText(/genai daily routine & exposure optimizer/i)).toBeInTheDocument();
  });

  it('renders DirectImpactExplainer with quantified metrics', () => {
    renderWithContext(<DirectImpactExplainer />);
    expect(screen.getByText(/direct impact engine/i)).toBeInTheDocument();
    expect(screen.getByText(/total pm2\.5 inhalation avoided/i)).toBeInTheDocument();
  });

  it('renders IAQCenter with room CADR builder and window timetable', () => {
    renderWithContext(<IAQCenter />);
    expect(screen.getByText(/room cadr & air changes calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/thermal inversion ventilation timetable/i)).toBeInTheDocument();
  });

  it('renders TransitPlanner with station options and multi-modal table', () => {
    renderWithContext(<TransitPlanner />);
    expect(screen.getByLabelText(/origin station:/i)).toBeInTheDocument();
    expect(screen.getByText(/multi-modal inhaled dose/i)).toBeInTheDocument();
  });

  it('renders CommunityHub with collective impact ticker and pledges', () => {
    renderWithContext(<CommunityHub />);
    expect(screen.getByText(/neighborhood collective impact ticker/i)).toBeInTheDocument();
    expect(screen.getByText(/neighborhood collective pledges/i)).toBeInTheDocument();
  });
});
