"use client";

import { theme_tokens } from "@/styles/theme_tokens";

type SparklineProps = {
  values: number[];
  label: string;
  width?: number;
  height?: number;
};

const vertical_padding = 3;

export const Sparkline = ({ values, label, width = 112, height = 34 }: SparklineProps) => {
  if (values.length < 2) {
    return null;
  }

  const lowest = Math.min(...values);
  const highest = Math.max(...values);
  const range = highest - lowest || 1;
  const step = width / (values.length - 1);

  const points = values
    .map((value, index) => {
      const x = index * step;
      const y =
        highest === lowest
          ? height / 2
          : vertical_padding + (1 - (value - lowest) / range) * (height - vertical_padding * 2);

      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      <polyline
        points={points}
        fill="none"
        style={{ stroke: theme_tokens.colors.text_subtle }}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
