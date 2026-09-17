import { AccountType } from "@fluiuae/database/enums";

const account_type_labels: Record<AccountType, string> = {
  [AccountType.CHECKING]: "Conta corrente",
  [AccountType.SAVINGS]: "Poupança",
  [AccountType.SALARY]: "Conta salário",
};

export const translate_account_type = (type: AccountType): string => account_type_labels[type];

export const account_type_options = Object.values(AccountType).map((type) => ({
  value: type,
  label: account_type_labels[type],
}));
