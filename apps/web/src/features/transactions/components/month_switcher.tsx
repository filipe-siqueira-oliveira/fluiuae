"use client";

import type { Dayjs } from "dayjs";
import { CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react";
import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { media_mobile } from "@/styles/typography";
import { current_month, format_month_title, is_current_month } from "../helpers/transaction_month";

const { colors, fonts } = theme_tokens;

const SwitcherRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
`;

const SwitcherPill = styled.div`
  display: grid;
  grid-template-columns: 44px minmax(180px, auto) 44px;
  align-items: center;
  height: 52px;
  padding: 0 4px;
  border: 1px solid ${colors.border};
  border-radius: 999px;
  background: ${colors.surface};
  box-shadow: 0 1px 2px rgba(20, 35, 28, 0.04);

  ${media_mobile} {
    grid-template-columns: 44px minmax(0, 1fr) 44px;
    width: 100%;
  }
`;

const ArrowButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0 auto;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: ${colors.text_muted};
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover {
    background: ${colors.navigation_hover_background};
    color: ${colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: -2px;
  }
`;

const MonthTitle = styled.h2`
  margin: 0;
  padding: 0 8px;
  color: ${colors.text};
  font-family: ${fonts.display};
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-align: center;
  white-space: nowrap;
`;

const CurrentMonthButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 20px 0 16px;
  border: 1px solid ${colors.border};
  border-radius: 999px;
  background: ${colors.surface};
  box-shadow: 0 1px 2px rgba(20, 35, 28, 0.04);
  color: ${colors.text};
  font-family: inherit;
  font-size: ${theme_tokens.font_sizes.body};
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background-color 150ms ease;

  svg {
    color: ${colors.primary};
  }

  &:hover {
    border-color: ${colors.border_strong};
    background: ${colors.navigation_hover_background};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }

  ${media_mobile} {
    justify-content: center;
    width: 100%;
    height: 44px;
  }
`;

type MonthSwitcherProps = {
  month: Dayjs;
  on_change: (month: Dayjs) => void;
};

export const MonthSwitcher = ({ month, on_change }: MonthSwitcherProps) => (
  <SwitcherRow data-tour="transactions_month">
    <SwitcherPill>
      <ArrowButton type="button" aria-label="Mês anterior" onClick={() => on_change(month.subtract(1, "month"))}>
        <ChevronLeft size={20} />
      </ArrowButton>
      <MonthTitle aria-live="polite">{format_month_title(month)}</MonthTitle>
      <ArrowButton type="button" aria-label="Próximo mês" onClick={() => on_change(month.add(1, "month"))}>
        <ChevronRight size={20} />
      </ArrowButton>
    </SwitcherPill>
    {is_current_month(month) ? null : (
      <CurrentMonthButton type="button" onClick={() => on_change(current_month())}>
        <CalendarCheck size={17} strokeWidth={2} />
        Ir para o mês atual
      </CurrentMonthButton>
    )}
  </SwitcherRow>
);
