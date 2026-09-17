import type { DashboardWidgetKey } from "@/lib/dashboard_widgets";

export type WidgetSpan = number;

export const widget_spans: Record<DashboardWidgetKey, WidgetSpan> = {
  month_summary: 12,
  daily_pace: 8,
  balance: 4,
  upcoming: 6,
  category_spending: 6,
  cash_flow: 8,
  credit_cards: 4,
  top_expenses: 6,
  payment_methods: 6,
  savings_rate: 4,
  daily_average: 4,
  fixed_commitments: 4,
  installments: 6,
};

export const widget_order: DashboardWidgetKey[] = [
  "month_summary",
  "daily_pace",
  "balance",
  "upcoming",
  "category_spending",
  "cash_flow",
  "credit_cards",
  "savings_rate",
  "daily_average",
  "fixed_commitments",
  "top_expenses",
  "payment_methods",
  "installments",
];

const grid_columns = 12;

const tablet_span = (span: WidgetSpan): WidgetSpan => (span === 4 ? 6 : span === 8 ? 12 : span);

export const pack_widget_rows = (
  keys: DashboardWidgetKey[],
  resolve_span: (key: DashboardWidgetKey) => WidgetSpan
): Map<DashboardWidgetKey, WidgetSpan> => {
  const spans = new Map<DashboardWidgetKey, WidgetSpan>();
  let row: DashboardWidgetKey[] = [];
  let used = 0;

  const close_row = () => {
    const last = row[row.length - 1];

    if (last) {
      spans.set(last, (spans.get(last) ?? 0) + grid_columns - used);
    }

    row = [];
    used = 0;
  };

  for (const key of keys) {
    const span = Math.min(resolve_span(key), grid_columns);

    if (used + span > grid_columns) {
      close_row();
    }

    spans.set(key, span);
    row.push(key);
    used += span;
  }

  close_row();

  return spans;
};

export const build_widget_layout = (keys: DashboardWidgetKey[]) => ({
  desktop: pack_widget_rows(keys, (key) => widget_spans[key]),
  tablet: pack_widget_rows(keys, (key) => tablet_span(widget_spans[key])),
});
