import { FixedTransactionsView } from "@/features/fixed_transactions/fixed_transactions_view";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { can_write_data } from "@/server/authorization/member_permissions";
import { list_accounts } from "@/server/services/account_service";
import { list_categories } from "@/server/services/category_service";
import { list_credit_cards } from "@/server/services/credit_card_service";
import { list_fixed_transactions } from "@/server/services/fixed_transaction_service";
import { is_category_compatible } from "@/lib/category_compatibility";
import type { FixedTransactionType } from "@/validation/fixed_transaction_schemas";

type FixedTransactionsScreenProps = {
  type: FixedTransactionType;
};

export const FixedTransactionsScreen = async ({ type }: FixedTransactionsScreenProps) => {
  const context = await require_authenticated_context();

  const [fixed_transactions, accounts, credit_cards, categories] = await Promise.all([
    list_fixed_transactions(context.workspace.id, type),
    list_accounts(context.workspace.id),
    list_credit_cards(context.workspace.id),
    list_categories(context.workspace.id),
  ]);

  return (
    <FixedTransactionsView
      type={type}
      fixed_transactions={fixed_transactions}
      accounts={accounts.filter((account) => !account.is_archived)}
      credit_cards={credit_cards}
      categories={categories.filter(
        (category) => is_category_compatible(category.kind, type) && !category.is_archived
      )}
      can_write={can_write_data(context.role)}
    />
  );
};
