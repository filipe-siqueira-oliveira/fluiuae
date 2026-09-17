import type { DashboardWidgetKey } from "@/lib/dashboard_widgets";
import { BalanceWidget } from "../widgets/balance_widget";
import { CashFlowWidget } from "../widgets/cash_flow_widget";
import { CategorySpendingWidget } from "../widgets/category_spending_widget";
import { CreditCardsWidget } from "../widgets/credit_cards_widget";
import { DailyAverageWidget } from "../widgets/daily_average_widget";
import { DailyPaceWidget } from "../widgets/daily_pace_widget";
import { FixedCommitmentsWidget } from "../widgets/fixed_commitments_widget";
import { InstallmentsWidget } from "../widgets/installments_widget";
import { MonthSummaryWidget } from "../widgets/month_summary_widget";
import { PaymentMethodsWidget } from "../widgets/payment_methods_widget";
import { SavingsRateWidget } from "../widgets/savings_rate_widget";
import { TopExpensesWidget } from "../widgets/top_expenses_widget";
import { UpcomingWidget } from "../widgets/upcoming_widget";
import type { DashboardDto } from "@/types/api";

export const widget_components: Record<DashboardWidgetKey, (props: { dashboard: DashboardDto }) => React.ReactNode> = {
  month_summary: MonthSummaryWidget,
  balance: BalanceWidget,
  upcoming: UpcomingWidget,
  category_spending: CategorySpendingWidget,
  daily_pace: DailyPaceWidget,
  cash_flow: CashFlowWidget,
  credit_cards: CreditCardsWidget,
  top_expenses: TopExpensesWidget,
  savings_rate: SavingsRateWidget,
  daily_average: DailyAverageWidget,
  fixed_commitments: FixedCommitmentsWidget,
  installments: InstallmentsWidget,
  payment_methods: PaymentMethodsWidget,
};
