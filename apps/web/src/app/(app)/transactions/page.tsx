import { TransactionsView } from "@/features/transactions/transactions_view";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { can_write_data } from "@/server/authorization/member_permissions";
import { list_accounts } from "@/server/services/account_service";
import { list_categories } from "@/server/services/category_service";
import { list_credit_cards } from "@/server/services/credit_card_service";
import { generate_due_scheduled_transactions } from "@/server/services/scheduled_transaction_generator";
import {
  list_transactions,
  summarize_transactions,
} from "@/server/services/transaction_service";

const build_current_month_query = () => {
  const now = new Date();

  return {
    start_date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    end_date: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString(),
  };
};

const TransactionsPage = async () => {
  const context = await require_authenticated_context();

  await generate_due_scheduled_transactions(context.workspace.id);

  const [transactions, summary, accounts, credit_cards, categories] = await Promise.all([
    list_transactions(context.workspace.id, build_current_month_query()),
    summarize_transactions(context.workspace.id, build_current_month_query()),
    list_accounts(context.workspace.id),
    list_credit_cards(context.workspace.id),
    list_categories(context.workspace.id),
  ]);

  return (
    <TransactionsView
      initial_result={{ transactions, summary }}
      accounts={accounts}
      credit_cards={credit_cards}
      categories={categories}
      can_write={can_write_data(context.role)}
    />
  );
};

export default TransactionsPage;
