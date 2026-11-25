// ============================================================
// src/components/Assistant/ChatMessageItem.tsx
// Renders a single user or GenAI assistant chat bubble
// ============================================================

import React from 'react';
import type { AssistantMessage } from '@/types/assistant';

interface ChatMessageItemProps {
  message: AssistantMessage;
  onSelectFollowup: (prompt: string) => void;
}

/** Accessible message bubble displaying GenAI guidance, impact metrics, and follow-ups. */
export const ChatMessageItem: React.FC<ChatMessageItemProps> = React.memo(({
  message,
  onSelectFollowup,
}) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}>
      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
        <span>{isUser ? 'You' : 'AeroPulse Copilot'}</span>
        <span>•</span>
        <span>{message.timestamp}</span>
      </div>

      <div
        className={`p-4 rounded-2xl max-w-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
          isUser
            ? 'bg-emerald-600 text-white rounded-br-none'
            : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-line">{message.content}</p>

        {message.directImpactSummary && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
              🛡️ {message.directImpactSummary.pm25AvertedMicrograms} µg PM2.5 Inhaled Averted
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
              🌱 {message.directImpactSummary.co2AvertedKg} kg CO₂ Saved
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
              🫁 -{message.directImpactSummary.riskReductionPercent}% Alveolar Risk
            </span>
          </div>
        )}

        {message.recommendedActions && (
          <ul className="mt-2 space-y-1 text-xs text-slate-300 list-disc list-inside">
            {message.recommendedActions.map((act) => (
              <li key={act}>{act}</li>
            ))}
          </ul>
        )}
      </div>

      {!isUser && message.suggestedPromptFollowups && (
        <div className="flex flex-wrap gap-1.5 mt-2 max-w-2xl">
          {message.suggestedPromptFollowups.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => onSelectFollowup(chip)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 transition-all focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              💡 {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

ChatMessageItem.displayName = 'ChatMessageItem';
