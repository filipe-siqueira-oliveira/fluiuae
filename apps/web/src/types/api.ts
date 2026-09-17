import type {
  AccountType,
  CategoryKind,
  InvitationStatus,
  MemberRole,
  TransactionStatus,
  TransactionType,
  WhatsappSessionStatus,
} from "@fluiuae/database/enums";

export type AccountDto = {
  id: string;
  name: string;
  type: AccountType;
  institution: string | null;
  institution_ispb: string | null;
  institution_has_logo: boolean;
  initial_balance: string;
  is_archived: boolean;
  is_default: boolean;
  current_balance: string;
  month_income: string;
  month_expense: string;
  balance_trend: number[];
};

export type AccountsSummaryDto = {
  total_balance: string;
  month_income: string;
  month_expense: string;
  month_start: string;
};

export type CreditCardDto = {
  id: string;
  name: string;
  institution: string | null;
  institution_ispb: string | null;
  institution_has_logo: boolean;
  credit_limit: string;
  statement_closing_day: number;
  payment_due_day: number;
  is_default: boolean;
  next_closing_date: string;
  next_due_date: string;
  open_statement_due_date: string;
  used_amount: string;
};

export type CreditCardCommitmentsDto = {
  remaining_amount: string;
  installment_count: number;
  purchase_count: number;
};

export type CreditCardStatementPaymentDto = {
  transaction_id: string;
  amount: string;
  paid_at: string;
  account: { id: string; name: string } | null;
};

export type CreditCardStatementDetailDto = {
  statement_key: string;
  statement_month: string;
  closing_date: string;
  due_date: string;
  phase: "OPEN" | "CLOSED" | "UPCOMING";
  status: "PAID" | "OVERDUE" | "PENDING";
  total: string;
  payment: CreditCardStatementPaymentDto | null;
  purchases: TransactionDto[];
};

export type InstitutionDto = {
  ispb: string;
  compe: string | null;
  name: string;
  legal_name: string;
  has_logo: boolean;
  is_featured: boolean;
};

export type CategoryDto = {
  id: string;
  name: string;
  kind: CategoryKind;
  color: string;
  is_system: boolean;
  is_default: boolean;
  is_archived: boolean;
};

export type CategoryReferenceDto = {
  id: string;
  name: string;
  kind: CategoryKind;
  color: string;
};

export type TransactionDto = {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  amount: string;
  issued_at: string;
  due_date: string | null;
  paid_at: string | null;
  notes: string | null;
  fixed_transaction_id: string | null;
  recurring_charge_id: string | null;
  installment_number: number | null;
  installment_count: number | null;
  account: { id: string; name: string } | null;
  credit_card: { id: string; name: string } | null;
  destination_account: { id: string; name: string } | null;
  category: CategoryReferenceDto | null;
  created_by: { id: string; name: string } | null;
  is_statement_payment: boolean;
  is_automatic_debit: boolean;
  card_statement: { due_date: string; is_overdue: boolean } | null;
};

export type FixedTransactionDto = {
  id: string;
  type: TransactionType;
  description: string;
  amount: string;
  day_of_month: number;
  starts_at_month: string;
  last_generated_month: string | null;
  account: { id: string; name: string } | null;
  credit_card: { id: string; name: string } | null;
  category: CategoryReferenceDto | null;
  is_automatic_debit: boolean;
};

export type RecurringChargeDto = {
  id: string;
  description: string;
  installment_amount: string;
  installment_count: number;
  generated_count: number;
  total_amount: string;
  remaining_amount: string;
  day_of_month: number;
  starts_at_month: string;
  ends_at_month: string;
  account: { id: string; name: string } | null;
  credit_card: { id: string; name: string } | null;
  category: CategoryReferenceDto | null;
  is_automatic_debit: boolean;
};

export type TransactionSummaryDto = {
  total_income_paid: string;
  total_income_pending: string;
  total_expense_paid: string;
  total_expense_pending: string;
  net_balance: string;
};

export type DashboardMoneyPair = { paid: string; pending: string };

export type DashboardUpcomingItem = {
  key: string;
  kind: "transaction" | "statement";
  description: string;
  detail: string;
  amount: string;
  due_date: string;
  is_income: boolean;
  is_overdue: boolean;
  href: string;
};

export type DashboardDto = {
  month_start: string;
  days_in_month: number;
  today_day: number;
  widgets: import("@/lib/dashboard_widgets").DashboardWidgetKey[];
  summary: { income: DashboardMoneyPair; expense: DashboardMoneyPair; previous_expense_total: string };
  balance: { total: string; accounts: { id: string; name: string; balance: string; institution_ispb: string | null; institution_has_logo: boolean; institution: string | null }[] };
  upcoming: DashboardUpcomingItem[];
  categories: { key: string; name: string; color: string; amount: string }[];
  daily_pace: { day: number; current: string | null; previous: string }[];
  cash_flow: { month_start: string; income: string; expense: string }[];
  credit_cards: { id: string; name: string; open_total: string; due_date: string; used_amount: string; credit_limit: string }[];
  top_expenses: { id: string; description: string; amount: string; issued_at: string; category_name: string | null; category_color: string | null }[];
  fixed_commitments: { fixed_expense_total: string; fixed_income_total: string; installments_month_total: string };
  installments: { active_count: number; remaining_total: string; month_total: string; next_ending: { description: string; ends_at_month: string } | null };
  payment_methods: { account_total: string; card_total: string };
};

export type ProfileDto = {
  name: string;
  email: string;
  phone: string | null;
  member_since: string;
  workspace_name: string;
};

export type MemberDto = {
  id: string;
  role: MemberRole;
  created_at: string;
  user: { id: string; name: string; email: string; phone: string | null };
};

export type InvitationDto = {
  id: string;
  email: string;
  role: MemberRole;
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
};

export type WhatsappSessionDto = {
  status: WhatsappSessionStatus;
  phone_number: string | null;
  qr_code: string | null;
  last_connected_at: string | null;
  last_error: string | null;
};

export type WorkspaceSummaryDto = {
  id: string;
  name: string;
  owner_name: string;
  role: MemberRole;
};

export type ApiSuccess<T> = { data: T };

export type ApiFailure = { error: string; details?: unknown };
