import dayjs from "dayjs";
import { TransactionStatus, TransactionType } from "@fluiuae/database/enums";
import type { StatusPillTone } from "@/components/data/status_pill";
import { format_money } from "@/lib/money_formatter";
import { theme_tokens } from "@/styles/theme_tokens";
import type { TransactionDto } from "@/types/api";

const { colors } = theme_tokens;

export const describe_transaction_meta = (transaction: TransactionDto): string => {
  if (transaction.type === TransactionType.TRANSFER) {
    return `${transaction.account?.name ?? "Conta"} para ${transaction.destination_account?.name ?? "outra conta"}`;
  }

  const parts = [
    transaction.category?.name ?? "Sem categoria",
    transaction.credit_card?.name ?? transaction.account?.name,
    transaction.installment_number && transaction.installment_count
      ? `parcela ${transaction.installment_number} de ${transaction.installment_count}`
      : transaction.fixed_transaction_id
        ? transaction.type === TransactionType.INCOME
          ? "receita fixa"
          : "despesa fixa"
        : null,
  ];

  return parts.filter(Boolean).join(" · ");
};

export const resolve_icon_color = (transaction: TransactionDto): string => {
  if (transaction.type === TransactionType.TRANSFER) {
    return colors.text_subtle;
  }

  return transaction.category?.color ?? (transaction.type === TransactionType.INCOME ? colors.income : colors.text_muted);
};

export const format_signed_amount = (transaction: TransactionDto): string => {
  if (transaction.type === TransactionType.TRANSFER) {
    return format_money(transaction.amount);
  }

  return `${transaction.type === TransactionType.INCOME ? "+" : "−"} ${format_money(transaction.amount)}`;
};

export const resolve_amount_color = (transaction: TransactionDto): string =>
  transaction.type === TransactionType.INCOME ? colors.income : colors.text;

export type StatusBadge = {
  label: string;
  tone: StatusPillTone;
  can_settle: boolean;
};

const is_account_overdue = (transaction: TransactionDto): boolean =>
  dayjs(transaction.due_date ?? transaction.issued_at).isBefore(dayjs(), "day");

export const resolve_status_badge = (transaction: TransactionDto): StatusBadge | null => {
  if (transaction.type === TransactionType.TRANSFER) {
    return null;
  }

  const is_income = transaction.type === TransactionType.INCOME;

  if (transaction.status === TransactionStatus.PAID) {
    return { label: is_income ? "Recebido" : "Pago", tone: "income", can_settle: false };
  }

  if (transaction.is_automatic_debit && !transaction.credit_card) {
    return { label: is_income ? "Entra no dia" : "Débito automático", tone: "neutral", can_settle: is_income };
  }

  const can_settle = !transaction.credit_card;
  const is_overdue = transaction.credit_card
    ? Boolean(transaction.card_statement?.is_overdue)
    : is_account_overdue(transaction);

  if (is_overdue) {
    return { label: "Atrasado", tone: "danger", can_settle };
  }

  return { label: is_income ? "A receber" : "A pagar", tone: "pending", can_settle };
};
