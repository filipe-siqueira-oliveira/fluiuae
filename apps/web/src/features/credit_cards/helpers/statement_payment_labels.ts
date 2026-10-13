import type { CreditCardStatementDetailDto, CreditCardStatementPaymentDto } from "@/types/api";

export const describe_payment_kind = (payment: CreditCardStatementPaymentDto): string =>
  payment.is_advance ? "Pagamento antecipado" : "Pagamento da fatura";

export const resolve_last_payment = (statement: CreditCardStatementDetailDto): CreditCardStatementPaymentDto | null =>
  statement.payments.reduce<CreditCardStatementPaymentDto | null>(
    (latest, payment) => (!latest || payment.paid_at > latest.paid_at ? payment : latest),
    null
  );

export const is_advance_payment_flow = (statement: CreditCardStatementDetailDto): boolean => statement.phase === "OPEN";
