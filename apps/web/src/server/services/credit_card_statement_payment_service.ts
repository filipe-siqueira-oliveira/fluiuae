import { CategoryKind, TransactionStatus, TransactionType, prisma_client, type Prisma } from "@fluiuae/database";
import { bad_request, conflict, not_found } from "@/lib/http_error";
import { parse_month_string } from "@/lib/month_calendar";
import {
  describe_statement_dates,
  find_credit_card_or_fail,
  load_card_purchases_by_statement,
} from "./credit_card_statement_builder";
import type { PayCreditCardStatementInput } from "@/validation/credit_card_statement_payment_schemas";

const statement_payment_category_name = "Cartão de crédito";

const due_month_formatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const describe_payment = (credit_card_name: string, due_date: Date): string =>
  `Pagamento da fatura de ${due_month_formatter.format(due_date)} (${credit_card_name})`;

export const pay_credit_card_statement = async (
  workspace_id: string,
  created_by_id: string,
  credit_card_id: string,
  statement_key: string,
  input: PayCreditCardStatementInput
): Promise<void> => {
  const credit_card = await find_credit_card_or_fail(workspace_id, credit_card_id);
  const statement_month = parse_month_string(statement_key);
  const purchases = (await load_card_purchases_by_statement(credit_card)).get(statement_month.getTime()) ?? [];
  const total = purchases.reduce((sum, purchase) => sum + Number(purchase.amount), 0);

  if (total <= 0) {
    throw bad_request("statement_has_no_purchases");
  }

  const [account, payment_category, existing_payment] = await Promise.all([
    prisma_client.account.findFirst({ where: { id: input.account_id, workspace_id, is_archived: false } }),
    prisma_client.category.findFirst({
      where: { workspace_id, is_system: true, kind: CategoryKind.EXPENSE, name: statement_payment_category_name },
    }),
    prisma_client.creditCardStatementPayment.findUnique({
      where: { credit_card_id_statement_month: { credit_card_id, statement_month } },
    }),
  ]);

  if (!account) {
    throw bad_request("account_not_in_workspace");
  }

  if (existing_payment) {
    throw conflict("statement_already_paid");
  }

  const paid_at = new Date(input.paid_at);
  const { due_date } = describe_statement_dates(credit_card, statement_month);

  await prisma_client.$transaction(async (transaction_client) => {
    const payment_transaction = await transaction_client.transaction.create({
      data: {
        workspace_id,
        created_by_id,
        account_id: account.id,
        category_id: payment_category?.id ?? null,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.PAID,
        description: describe_payment(credit_card.name, due_date),
        amount: total.toFixed(2),
        issued_at: paid_at,
        due_date,
        paid_at,
      },
    });

    await transaction_client.creditCardStatementPayment.create({
      data: { workspace_id, credit_card_id, statement_month, transaction_id: payment_transaction.id },
    });

    await transaction_client.transaction.updateMany({
      where: { id: { in: purchases.map((purchase) => purchase.id) } },
      data: { status: TransactionStatus.PAID, paid_at },
    });
  });
};

export const revert_statement_purchases = async (
  transaction_client: Prisma.TransactionClient,
  payment: { credit_card_id: string; statement_month: Date; workspace_id: string }
): Promise<void> => {
  const credit_card = await find_credit_card_or_fail(payment.workspace_id, payment.credit_card_id);
  const purchases = (await load_card_purchases_by_statement(credit_card)).get(payment.statement_month.getTime()) ?? [];

  await transaction_client.transaction.updateMany({
    where: { id: { in: purchases.map((purchase) => purchase.id) } },
    data: { status: TransactionStatus.PENDING, paid_at: null },
  });
};

export const undo_credit_card_statement_payment = async (
  workspace_id: string,
  credit_card_id: string,
  statement_key: string
): Promise<void> => {
  await find_credit_card_or_fail(workspace_id, credit_card_id);

  const payment = await prisma_client.creditCardStatementPayment.findFirst({
    where: { workspace_id, credit_card_id, statement_month: parse_month_string(statement_key) },
  });

  if (!payment) {
    throw not_found("statement_payment_not_found");
  }

  await prisma_client.$transaction(async (transaction_client) => {
    await revert_statement_purchases(transaction_client, payment);
    await transaction_client.transaction.delete({ where: { id: payment.transaction_id } });
  });
};
