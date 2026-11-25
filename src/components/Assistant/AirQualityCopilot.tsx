// ============================================================
// src/components/Assistant/AirQualityCopilot.tsx
// Interactive Conversational GenAI Air Quality & Smog Copilot
// ============================================================

import React, { useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useGenAIAssistant } from '@/hooks/useGenAIAssistant';
import { ChatMessageItem } from './ChatMessageItem';

/** Conversational GenAI assistant panel backed by live telemetry and persona context. */
export const AirQualityCopilot: React.FC = React.memo(() => {
  const { state, activeZone } = useApp();
  const {
    chatHistory,
    inputPrompt,
    setInputPrompt,
    sendMessage,
    isPending,
    errorMessage,
  } = useGenAIAssistant();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <section aria-labelledby="copilot-heading" className="space-y-4">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 id="copilot-heading" className="text-xl font-black text-white flex items-center gap-2">
              <span>🤖</span> GenAI Air Quality & Smog Copilot
            </h2>
            <p className="text-xs text-slate-400">
              Personalized, zero-hallucination medical & environmental guidance for families
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
              Persona: {state.selectedPersona}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-semibold">
              {activeZone.name} ({activeZone.currentAqi} AQI)
            </span>
          </div>
        </div>
      </div>

      <div
        className="bg-[#070b12] border border-slate-800 rounded-2xl p-4 sm:p-5 h-[480px] overflow-y-auto space-y-4 shadow-inner"
        role="log"
        aria-label="Conversation with Air Quality Assistant"
        aria-live="polite"
      >
        {chatHistory.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} onSelectFollowup={sendMessage} />
        ))}

        {isPending && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold p-3 bg-slate-900/60 rounded-xl w-fit border border-slate-800 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Analyzing atmospheric lapse rates and compiling clinical routine...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {errorMessage && (
        <div className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 p-2.5 rounded-xl">
          ℹ️ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="copilot-input" className="sr-only">Ask AeroPulse Copilot</label>
        <input
          id="copilot-input"
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder={`Ask about routines, hacks, or commutes for ${state.selectedPersona}...`}
          disabled={isPending}
          className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-xl px-4 py-3 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-emerald-400"
        />
        <button
          type="submit"
          disabled={isPending || !inputPrompt.trim()}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all focus-visible:outline-2 focus-visible:outline-emerald-400"
        >
          Send
        </button>
      </form>
    </section>
  );
});

AirQualityCopilot.displayName = 'AirQualityCopilot';
