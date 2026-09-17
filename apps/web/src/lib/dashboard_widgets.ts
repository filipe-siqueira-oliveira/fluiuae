export const dashboard_widget_keys = [
  "month_summary",
  "balance",
  "upcoming",
  "category_spending",
  "daily_pace",
  "cash_flow",
  "credit_cards",
  "top_expenses",
  "savings_rate",
  "daily_average",
  "fixed_commitments",
  "installments",
  "payment_methods",
] as const;

export type DashboardWidgetKey = (typeof dashboard_widget_keys)[number];

export type DashboardWidgetGroup = "main" | "more";

export type DashboardWidgetDefinition = {
  key: DashboardWidgetKey;
  title: string;
  description: string;
  group: DashboardWidgetGroup;
};

export const dashboard_widget_definitions: DashboardWidgetDefinition[] = [
  { key: "month_summary", title: "Resumo do mês", description: "Quanto entrou, saiu e sobrou neste mês.", group: "main" },
  { key: "balance", title: "Saldo das contas", description: "Quanto tem em cada conta agora.", group: "main" },
  { key: "upcoming", title: "Próximos pagamentos", description: "Contas e faturas atrasadas ou que vencem em 15 dias.", group: "main" },
  { key: "category_spending", title: "Gastos por categoria", description: "Para onde foi o dinheiro neste mês.", group: "main" },
  { key: "daily_pace", title: "Ritmo de gastos", description: "Gasto acumulado dia a dia, comparado ao mês passado.", group: "main" },
  { key: "cash_flow", title: "Receitas e despesas", description: "Os últimos 6 meses lado a lado.", group: "more" },
  { key: "credit_cards", title: "Cartões", description: "Fatura aberta, vencimento e limite usado.", group: "more" },
  { key: "top_expenses", title: "Maiores despesas", description: "As 5 despesas mais altas do mês.", group: "more" },
  { key: "savings_rate", title: "Quanto sobrou", description: "Parte das receitas que ficou com você.", group: "more" },
  { key: "daily_average", title: "Média por dia", description: "Gasto médio diário e a projeção até o fim do mês.", group: "more" },
  { key: "fixed_commitments", title: "Compromissos fixos", description: "Quanto da renda já está comprometido todo mês.", group: "more" },
  { key: "installments", title: "Parcelas em andamento", description: "Quanto ainda falta pagar em compras parceladas.", group: "more" },
  { key: "payment_methods", title: "Conta ou cartão", description: "Como você pagou as despesas do mês.", group: "more" },
];

export const default_dashboard_widgets: DashboardWidgetKey[] = [
  "month_summary",
  "balance",
  "upcoming",
  "category_spending",
  "daily_pace",
  "cash_flow",
  "credit_cards",
];

export const sanitize_dashboard_widgets = (value: unknown): DashboardWidgetKey[] =>
  Array.isArray(value)
    ? dashboard_widget_keys.filter((key) => value.includes(key))
    : default_dashboard_widgets;
