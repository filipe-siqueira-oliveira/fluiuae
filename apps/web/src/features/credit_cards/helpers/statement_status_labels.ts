import type { StatusPillTone } from "@/components/data/status_pill";
import type { CreditCardStatementDetailDto } from "@/types/api";

type StatementBadge = {
  label: string;
  tone: StatusPillTone;
};

const status_badges: Record<CreditCardStatementDetailDto["status"], StatementBadge> = {
  PAID: { label: "Paga", tone: "income" },
  OVERDUE: { label: "Atrasada", tone: "danger" },
  PENDING: { label: "A pagar", tone: "pending" },
};

export const has_statement_charges = (statement: CreditCardStatementDetailDto): boolean =>
  Number(statement.total) > 0;

export const resolve_statement_badge = (statement: CreditCardStatementDetailDto): StatementBadge =>
  statement.payment || has_statement_charges(statement)
    ? status_badges[statement.status]
    : { label: "Sem compras", tone: "neutral" };

export const describe_statement_list_state = (statement: CreditCardStatementDetailDto): string => {
  if (statement.payment) {
    return "Paga";
  }

  if (statement.phase === "OPEN") {
    return "Aberta";
  }

  if (statement.phase === "UPCOMING") {
    return "Próxima";
  }

  return resolve_statement_badge(statement).label;
};

export const pick_initial_statement_key = (statements: CreditCardStatementDetailDto[]): string | null =>
  (statements.find((statement) => statement.phase === "OPEN") ?? statements[0])?.statement_key ?? null;

export type StatementListTone = "paid" | "overdue" | "pending" | "open" | "muted";

export const resolve_statement_list_tone = (statement: CreditCardStatementDetailDto): StatementListTone => {
  if (statement.payment) {
    return "paid";
  }

  if (statement.phase === "OPEN") {
    return "open";
  }

  if (statement.phase === "UPCOMING" || !has_statement_charges(statement)) {
    return "muted";
  }

  return statement.status === "OVERDUE" ? "overdue" : "pending";
};
