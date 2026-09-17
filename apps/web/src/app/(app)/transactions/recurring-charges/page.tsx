import { CategoryKind } from "@fluiuae/database";
import { is_category_compatible } from "@/lib/category_compatibility";
import { RecurringChargesView } from "@/features/recurring_charges/recurring_charges_view";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { can_write_data } from "@/server/authorization/member_permissions";
import { list_accounts } from "@/server/services/account_service";
import { list_categories } from "@/server/services/category_service";
import { list_credit_cards } from "@/server/services/credit_card_service";
import { list_recurring_charges } from "@/server/services/recurring_charge_service";
import { generate_due_recurring_charges } from "@/server/services/recurring_charge_generator";

const RecurringChargesPage = async () => {
  const context = await require_authenticated_context();

  await generate_due_recurring_charges(context.workspace.id);

  const [recurring_charges, accounts, credit_cards, categories] = await Promise.all([
    list_recurring_charges(context.workspace.id),
    list_accounts(context.workspace.id),
    list_credit_cards(context.workspace.id),
    list_categories(context.workspace.id),
  ]);

  return (
    <RecurringChargesView
      recurring_charges={recurring_charges}
      accounts={accounts.filter((account) => !account.is_archived)}
      credit_cards={credit_cards}
      categories={categories.filter(
        (category) =>
          is_category_compatible(category.kind, CategoryKind.EXPENSE) && !category.is_archived
      )}
      can_write={can_write_data(context.role)}
    />
  );
};

export default RecurringChargesPage;
