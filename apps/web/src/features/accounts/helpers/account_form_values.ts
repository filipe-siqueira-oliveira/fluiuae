import { AccountType } from "@fluiuae/database/enums";
import {
  build_institution_form_fields,
  to_institution_payload_fields,
  type InstitutionFormFields,
} from "@/features/institutions/helpers/institution_form_fields";
import type { AccountPayload } from "../api/accounts_api";
import type { AccountDto } from "@/types/api";

export type AccountFormValues = InstitutionFormFields & {
  name: string;
  type: AccountType;
  initial_balance: number;
  is_default: boolean;
};

export const build_account_form_values = (account: AccountDto | null): AccountFormValues => ({
  ...build_institution_form_fields(account),
  name: account?.name ?? "",
  type: account?.type ?? AccountType.CHECKING,
  initial_balance: Number(account?.initial_balance ?? 0),
  is_default: account?.is_default ?? false,
});

export const to_account_payload = (values: AccountFormValues): AccountPayload => ({
  ...to_institution_payload_fields(values),
  name: values.name,
  type: values.type,
  initial_balance: values.initial_balance,
  is_default: Boolean(values.is_default),
});
