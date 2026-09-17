import { AccountsView } from "@/features/accounts/accounts_view";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { can_write_data } from "@/server/authorization/member_permissions";
import { list_accounts } from "@/server/services/account_service";
import { summarize_accounts } from "@/server/services/accounts_summary_service";
import { generate_due_scheduled_transactions } from "@/server/services/scheduled_transaction_generator";

const AccountsPage = async () => {
  const context = await require_authenticated_context();

  await generate_due_scheduled_transactions(context.workspace.id);

  const [accounts, summary] = await Promise.all([
    list_accounts(context.workspace.id),
    summarize_accounts(context.workspace.id),
  ]);

  return (
    <AccountsView accounts={accounts} summary={summary} can_write={can_write_data(context.role)} />
  );
};

export default AccountsPage;
