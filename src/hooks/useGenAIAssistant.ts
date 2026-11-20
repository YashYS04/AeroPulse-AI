// ============================================================
// src/hooks/useGenAIAssistant.ts
// Hook driving interactive conversational GenAI co-pilot
// ============================================================

import { useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { sendAssistantMessage } from '@/services/apiService';
import { AssistantMessage } from '@/types/assistant';

export function useGenAIAssistant() {
  const { state, dispatch, activeZone } = useApp();
  const [isPending, setIsPending] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const prompt = (textToSend || inputPrompt).trim();
      if (!prompt || isPending) return;

      const userMsg: AssistantMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        content: prompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMsg });
      setInputPrompt('');
      setIsPending(true);
      setErrorMessage(null);

      try {
        const response = await sendAssistantMessage(prompt, {
          persona: state.selectedPersona,
          zoneId: state.selectedZoneId,
          currentAqi: activeZone.currentAqi,
          isInversionActive: activeZone.temperatureInversionCap > activeZone.temperatureGround,
          hasAirPurifier: true,
        });

        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: response });
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'GenAI query failed. Please verify API configuration.'
        );
      } finally {
        setIsPending(false);
      }
    },
    [inputPrompt, isPending, state.selectedPersona, state.selectedZoneId, activeZone, dispatch]
  );

  return {
    chatHistory: state.chatHistory,
    inputPrompt,
    setInputPrompt,
    sendMessage,
    isPending,
    errorMessage,
  };
}
