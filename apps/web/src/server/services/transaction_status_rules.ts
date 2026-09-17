import { TransactionStatus, TransactionType } from "@fluiuae/database";
import { end_of_today, resolve_automatic_debit } from "./automatic_debit_rules";
import type { CreateTransactionInput, UpdateTransactionInput } from "@/validation/transaction_schemas";

type StatusSnapshot = {
  credit_card_id: string | null;
  account_id: string | null;
  is_automatic_debit: boolean;
  status: TransactionStatus;
  paid_at: Date | null;
};

type ResolvedStatus = {
  status: TransactionStatus;
  paid_at: Date | null;
  is_automatic_debit: boolean;
};

type StatusInput = CreateTransactionInput | UpdateTransactionInput;

const start_of_today = (): Date => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const is_before_today = (input: StatusInput): boolean => new Date(input.issued_at).getTime() < start_of_today().getTime();

const is_account_expense = (input: StatusInput): boolean =>
  input.type === TransactionType.EXPENSE && Boolean(input.account_id) && !input.credit_card_id;

const paid_on_date = (input: StatusInput, is_automatic_debit: boolean): ResolvedStatus => ({
  status: TransactionStatus.PAID,
  paid_at: new Date(input.issued_at),
  is_automatic_debit,
});

const settles_on_date = (input: StatusInput): ResolvedStatus =>
  new Date(input.issued_at).getTime() <= end_of_today().getTime()
    ? paid_on_date(input, true)
    : { status: TransactionStatus.PENDING, paid_at: null, is_automatic_debit: true };

const pending = (): ResolvedStatus => ({ status: TransactionStatus.PENDING, paid_at: null, is_automatic_debit: false });

export const resolve_created_status = (input: CreateTransactionInput): ResolvedStatus => {
  if (input.credit_card_id) {
    return pending();
  }

  if (is_account_expense(input)) {
    if (is_before_today(input)) {
      return paid_on_date(input, resolve_automatic_debit(input));
    }

    return resolve_automatic_debit(input) ? settles_on_date(input) : pending();
  }

  return settles_on_date(input);
};

export const resolve_updated_status = (existing: StatusSnapshot, input: UpdateTransactionInput): ResolvedStatus => {
  if (input.credit_card_id) {
    return existing.credit_card_id === input.credit_card_id
      ? { status: existing.status, paid_at: existing.paid_at, is_automatic_debit: false }
      : pending();
  }

  const keeps_existing_payment = existing.status === TransactionStatus.PAID && !existing.credit_card_id;

  if (is_account_expense(input)) {
    const is_automatic_debit = resolve_automatic_debit(input);

    if (is_before_today(input)) {
      return { ...paid_on_date(input, is_automatic_debit), paid_at: keeps_existing_payment ? existing.paid_at : new Date(input.issued_at) };
    }

    if (is_automatic_debit) {
      return settles_on_date(input);
    }

    return keeps_existing_payment && !existing.is_automatic_debit
      ? { status: existing.status, paid_at: existing.paid_at, is_automatic_debit: false }
      : pending();
  }

  return keeps_existing_payment
    ? { status: TransactionStatus.PAID, paid_at: existing.paid_at, is_automatic_debit: true }
    : settles_on_date(input);
};
