// ============================================================
// src/components/shared/Sparkline.tsx
// Pure native SVG sparkline with WCAG .sr-only twin representation
// ============================================================

import React from 'react';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  label: string;
}

export const Sparkline: React.FC<SparklineProps> = React.memo(({
  data,
  color = '#10b981',
  height = 36,
  width = 120,
  label,
}) => {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;
  const effW = width - padding * 2;
  const effH = height - padding * 2;

  const points = data
    .map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * effW;
      const y = height - padding - ((val - min) / range) * effH;
      return `${Math.round(x)},${Math.round(y)}`;
    })
    .join(' ');

  return (
    <div className="flex items-center gap-2" aria-label={`${label} sparkline trend`}>
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        aria-hidden="true"
        role="presentation"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {data.map((val, idx) => {
          const cx = padding + (idx / (data.length - 1)) * effW;
          const cy = height - padding - ((val - min) / range) * effH;
          return (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r={idx === data.length - 1 ? 3 : 1.5}
              fill={color}
            />
          );
        })}
      </svg>
      {/* WCAG SC 1.1.1 Non-text Content: Screen-reader twin list */}
      <div className="sr-only">
        <p>{label} historical hourly trend:</p>
        <ol>
          {data.map((val, idx) => (
            <li key={idx}>
              Hour -{data.length - idx}h: {val}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
});

Sparkline.displayName = 'Sparkline';
