import { format_money } from "./money_formatter";

export type SharedPurchaseEntryKind = "expense" | "receivable";

export type SharedPurchaseEntry = {
  workspace_id: string;
  kind: SharedPurchaseEntryKind;
  amount: number;
  description: string;
  notes: string;
};

export type SharedPurchaseParticipant = {
  workspace_id: string;
  person_name: string;
  amount: number;
};

type SharedPurchasePlanInput = {
  description: string;
  payer_workspace_id: string | null;
  installment_count: number;
  participants: [SharedPurchaseParticipant, SharedPurchaseParticipant];
};

const sum_amounts = (first_amount: number, second_amount: number): number =>
  (Math.round(first_amount * 100) + Math.round(second_amount * 100)) / 100;

export const describe_shared_value = (amount: number, installment_count: number): string =>
  installment_count > 1 ? `${installment_count}x de ${format_money(amount)}` : format_money(amount);

const plan_split_payment = (
  description: string,
  installment_count: number,
  [first, second]: [SharedPurchaseParticipant, SharedPurchaseParticipant]
): SharedPurchaseEntry[] => {
  const total = sum_amounts(first.amount, second.amount);
  const notes = `Compra de ${describe_shared_value(total, installment_count)} dividida: ${first.person_name} fica com ${describe_shared_value(first.amount, installment_count)} e ${second.person_name} com ${describe_shared_value(second.amount, installment_count)}.`;

  return [first, second]
    .filter((participant) => participant.amount > 0)
    .map((participant) => ({
      workspace_id: participant.workspace_id,
      kind: "expense",
      amount: participant.amount,
      description,
      notes,
    }));
};

const plan_single_payer = (
  description: string,
  installment_count: number,
  payer: SharedPurchaseParticipant,
  debtor: SharedPurchaseParticipant
): SharedPurchaseEntry[] => {
  const total = sum_amounts(payer.amount, debtor.amount);
  const purchase_notes = `Compra de ${describe_shared_value(total, installment_count)} paga por ${payer.person_name}.`;

  if (debtor.amount <= 0) {
    return [{ workspace_id: payer.workspace_id, kind: "expense", amount: total, description, notes: purchase_notes }];
  }

  const notes = `${purchase_notes} ${debtor.person_name} devolve ${describe_shared_value(debtor.amount, installment_count)}.`;

  return [
    { workspace_id: payer.workspace_id, kind: "expense", amount: total, description, notes },
    {
      workspace_id: payer.workspace_id,
      kind: "receivable",
      amount: debtor.amount,
      description: `${description} (a receber de ${debtor.person_name})`,
      notes,
    },
    {
      workspace_id: debtor.workspace_id,
      kind: "expense",
      amount: debtor.amount,
      description: `${description} (reembolso para ${payer.person_name})`,
      notes,
    },
  ];
};

export const plan_shared_purchase_entries = ({
  description,
  payer_workspace_id,
  installment_count,
  participants,
}: SharedPurchasePlanInput): SharedPurchaseEntry[] => {
  const [first, second] = participants;

  if (payer_workspace_id === first.workspace_id) {
    return plan_single_payer(description, installment_count, first, second);
  }

  if (payer_workspace_id === second.workspace_id) {
    return plan_single_payer(description, installment_count, second, first);
  }

  return plan_split_payment(description, installment_count, participants);
};
