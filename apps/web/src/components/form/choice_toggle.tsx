"use client";

import styled, { css } from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

const { colors } = theme_tokens;

export type ChoiceTone = "danger" | "income" | "warning" | "neutral";

const tones: Record<ChoiceTone, { text: string; background: string; border: string }> = {
  danger: { text: colors.danger, background: colors.danger_soft, border: colors.danger_border },
  income: { text: colors.income, background: colors.income_soft, border: colors.income_border },
  warning: { text: colors.pending, background: colors.pending_soft, border: colors.pending_border },
  neutral: { text: colors.text, background: colors.neutral_soft, border: colors.border_strong },
};

const ToggleGroup = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, minmax(0, 1fr));
  gap: 4px;
  padding: 4px;
  border: 1px solid ${colors.border_strong};
  border-radius: 999px;
  background: ${colors.surface};
`;

const ToggleOption = styled.button<{ $is_selected: boolean; $tone: ChoiceTone }>`
  min-width: 0;
  height: 40px;
  padding: 0 12px;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  color: ${colors.text};
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease;

  &:hover:not(:disabled) {
    background: ${colors.page_background};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: ${theme_tokens.layout.mobile_breakpoint}px) {
    padding: 0 6px;
    font-size: 14px;
  }

  ${({ $is_selected, $tone }) =>
    $is_selected &&
    css`
      border-color: ${tones[$tone].border};
      background: ${tones[$tone].background};
      color: ${tones[$tone].text};

      &:hover:not(:disabled) {
        background: ${tones[$tone].background};
      }
    `}
`;

export type ChoiceOption<TValue extends string> = {
  value: TValue;
  label: string;
  tone: ChoiceTone;
};

type ChoiceToggleProps<TValue extends string> = {
  id?: string;
  value?: TValue;
  onChange?: (value: TValue) => void;
  options: ChoiceOption<TValue>[];
  label: string;
  disabled?: boolean;
};

export const ChoiceToggle = <TValue extends string>({
  id,
  value,
  onChange,
  options,
  label,
  disabled = false,
}: ChoiceToggleProps<TValue>) => (
  <ToggleGroup id={id} role="radiogroup" aria-label={label} $count={options.length}>
    {options.map((option) => (
      <ToggleOption
        key={option.value}
        type="button"
        role="radio"
        aria-checked={value === option.value}
        disabled={disabled}
        $is_selected={value === option.value}
        $tone={option.tone}
        onClick={() => onChange?.(option.value)}
      >
        {option.label}
      </ToggleOption>
    ))}
  </ToggleGroup>
);
