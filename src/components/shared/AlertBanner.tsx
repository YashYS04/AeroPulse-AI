// ============================================================
// src/components/shared/AlertBanner.tsx
// High-visibility emergency alert banner with ARIA live region
// ============================================================

import React from 'react';

interface AlertBannerProps {
  title: string;
  message: string;
  severity?: 'Info' | 'Warning' | 'Critical';
  onDismiss?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = React.memo(({
  title,
  message,
  severity = 'Warning',
  onDismiss,
}) => {
  const styles = {
    Critical: 'bg-rose-950/80 border-rose-500/80 text-rose-100',
    Warning: 'bg-amber-950/80 border-amber-500/80 text-amber-100',
    Info: 'bg-emerald-950/80 border-emerald-500/80 text-emerald-100',
  }[severity];

  const badgeColor = {
    Critical: 'bg-rose-600 text-white',
    Warning: 'bg-amber-500 text-slate-950',
    Info: 'bg-emerald-600 text-white',
  }[severity];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`border rounded-xl p-4 shadow-lg backdrop-blur-md transition-all ${styles}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`text-xs uppercase font-extrabold px-2.5 py-1 rounded-full ${badgeColor}`}>
            {severity}
          </span>
          <h2 className="text-base font-bold tracking-tight">{title}</h2>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-slate-400 hover:text-white rounded-lg p-1 focus-visible:outline-2 focus-visible:outline-emerald-400"
            aria-label="Dismiss alert banner"
          >
            ✕
          </button>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed opacity-90">{message}</p>
    </div>
  );
});

AlertBanner.displayName = 'AlertBanner';
