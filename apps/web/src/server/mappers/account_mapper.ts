import type { Account } from "@fluiuae/database";
import { find_institution } from "@/server/institutions/institution_catalog";
import type { AccountActivity } from "@/server/services/account_activity_calculator";
import type { AccountDto } from "@/types/api";
import { serialize_decimal } from "./decimal_serializer";

const empty_activity: AccountActivity = { month_income: 0, month_expense: 0, balance_trend: [] };

export const to_account_dto = (
  account: Account,
  current_balance: string,
  activity: AccountActivity = empty_activity
): AccountDto => ({
  id: account.id,
  name: account.name,
  type: account.type,
  institution: account.institution,
  institution_ispb: account.institution_ispb,
  institution_has_logo: find_institution(account.institution_ispb)?.has_logo ?? false,
  initial_balance: serialize_decimal(account.initial_balance),
  is_archived: account.is_archived,
  is_default: account.is_default,
  current_balance,
  month_income: activity.month_income.toFixed(2),
  month_expense: activity.month_expense.toFixed(2),
  balance_trend: activity.balance_trend,
});
