import { TransactionType } from "@fluiuae/database/enums";

export type FixedTransactionType = typeof TransactionType.INCOME | typeof TransactionType.EXPENSE;

type FixedTransactionCopy = {
  title: string;
  description: string;
  create_button: string;
  create_modal_title: string;
  edit_modal_title: string;
  list_title: string;
  singular: string;
  plural: string;
  empty_title: string;
  empty_message: string;
  no_source_message: string;
  delete_label: string;
  delete_confirmation: string;
  launched_label: string;
  pending_label: string;
};

const fixed_transaction_copy: Record<FixedTransactionType, FixedTransactionCopy> = {
  [TransactionType.EXPENSE]: {
    title: "Despesas fixas",
    description: "Contas que se repetem todo mês. Cada uma vira um lançamento previsto no dia certo.",
    create_button: "Nova despesa fixa",
    create_modal_title: "Nova despesa fixa",
    edit_modal_title: "Editar despesa fixa",
    list_title: "Suas despesas fixas",
    singular: "despesa fixa",
    plural: "despesas fixas",
    empty_title: "Nenhuma despesa fixa ainda",
    empty_message: "Cadastre aluguel, internet ou academia uma vez e elas aparecem todo mês nos lançamentos.",
    no_source_message: "Cadastre uma conta bancária ou um cartão antes de adicionar despesas fixas.",
    delete_label: "Excluir despesa fixa",
    delete_confirmation: "Excluir esta despesa fixa? Os lançamentos já gerados continuam.",
    launched_label: "Já passou este mês",
    pending_label: "Ainda vem este mês",
  },
  [TransactionType.INCOME]: {
    title: "Receitas fixas",
    description: "Dinheiro que entra todo mês. No dia certo, entra sozinho no saldo da conta.",
    create_button: "Nova receita fixa",
    create_modal_title: "Nova receita fixa",
    edit_modal_title: "Editar receita fixa",
    list_title: "Suas receitas fixas",
    singular: "receita fixa",
    plural: "receitas fixas",
    empty_title: "Nenhuma receita fixa ainda",
    empty_message: "Cadastre salário, aluguel recebido ou mesada uma vez e elas aparecem todo mês nos lançamentos.",
    no_source_message: "Cadastre uma conta bancária antes de adicionar receitas fixas.",
    delete_label: "Excluir receita fixa",
    delete_confirmation: "Excluir esta receita fixa? Os lançamentos já gerados continuam.",
    launched_label: "Já passou este mês",
    pending_label: "Ainda entra este mês",
  },
};

export const read_fixed_transaction_copy = (type: FixedTransactionType): FixedTransactionCopy =>
  fixed_transaction_copy[type];
