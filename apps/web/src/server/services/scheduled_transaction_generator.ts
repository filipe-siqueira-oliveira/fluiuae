import { generate_due_fixed_transactions } from "./fixed_transaction_generator";
import { generate_due_recurring_charges } from "./recurring_charge_generator";

export const generate_due_scheduled_transactions = async (
  workspace_id: string,
  requested_date?: Date | null
): Promise<void> => {
  await generate_due_fixed_transactions(workspace_id, requested_date);
  await generate_due_recurring_charges(workspace_id, requested_date);
};
