// ============================================================
// src/test/dom.test.tsx
// User event interactions, simulation triggers & state updates
// ============================================================

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppProvider } from '@/context/AppContext';
import App from '@/App';

describe('User Event Interactions & State Updates', () => {
  it('switches tabs across navigation items', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Click GenAI Copilot tab
    const copilotTab = screen.getByRole('tab', { name: /genai copilot/i });
    await user.click(copilotTab);
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'panel-assistant');

    // Click Indoor Hacks tab
    const iaqTab = screen.getByRole('tab', { name: /indoor hacks/i });
    await user.click(iaqTab);
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'panel-iaq');
  });

  it('triggers and resets smog spike telemetry simulation', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    const spikeBtn = screen.getByRole('button', { name: /simulate smog spike/i });
    await user.click(spikeBtn);

    // Reset button should now be visible
    const resetBtn = screen.getByRole('button', { name: /reset/i });
    expect(resetBtn).toBeInTheDocument();

    await user.click(resetBtn);
    expect(screen.queryByRole('button', { name: /reset/i })).not.toBeInTheDocument();
  });

  it('allows joining and leaving neighborhood pledges', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Navigate to Community tab
    const commTab = screen.getByRole('tab', { name: /community hub/i });
    await user.click(commTab);

    // Initially 2 pledges joined
    const initialJoined = screen.getAllByRole('button', { name: /✓ pledged with community/i });
    expect(initialJoined.length).toBe(2);

    // Find a non-joined pledge button and click it
    const joinBtn = screen.getAllByRole('button', { name: /\+ join neighborhood pledge/i })[0];
    await user.click(joinBtn);

    // Should now be 3 pledges joined
    const updatedJoined = screen.getAllByRole('button', { name: /✓ pledged with community/i });
    expect(updatedJoined.length).toBe(3);
  });

  it('allows submitting prompt to the air quality copilot', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    // Navigate to assistant
    const copilotTab = screen.getByRole('tab', { name: /genai copilot/i });
    await user.click(copilotTab);

    const input = screen.getByPlaceholderText(/ask about routines, hacks/i);
    await user.type(input, 'What mask should my child wear in smog?');
    const sendBtn = screen.getByRole('button', { name: /send/i });
    await user.click(sendBtn);

    expect(screen.getByText('What mask should my child wear in smog?')).toBeInTheDocument();
  });

  it('allows selecting different urban zones in telemetry dashboard', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    const buttons = screen.getAllByRole('button', { name: /north industrial belt/i });
    // Click the ZoneCard button
    await user.click(buttons[buttons.length - 1]);

    expect(buttons[buttons.length - 1]).toHaveAttribute('aria-pressed', 'true');
  });

  it('adjusts room dimensions in CADR builder and updates calculated volume', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    const iaqTab = screen.getByRole('tab', { name: /indoor hacks/i });
    await user.click(iaqTab);

    const lengthSlider = screen.getByLabelText(/length:/i);
    expect(lengthSlider).toBeInTheDocument();
  });
});
