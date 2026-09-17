import { TransactionStatus, prisma_client } from "@fluiuae/database";
import { add_months, to_month_start } from "@/lib/month_calendar";
import { end_of_today } from "./automatic_debit_rules";

type ScheduleOwner = { fixed_transaction_id: string } | { recurring_charge_id: string };

export const remove_future_pending = async (owner: ScheduleOwner): Promise<Date | null> => {
  const future_filter = { ...owner, status: TransactionStatus.PENDING, issued_at: { gt: end_of_today() } };
  const earliest = await prisma_client.transaction.findFirst({
    where: future_filter,
    orderBy: { issued_at: "asc" },
    select: { issued_at: true },
  });

  if (!earliest) {
    return null;
  }

  await prisma_client.transaction.deleteMany({ where: future_filter });

  return to_month_start(earliest.issued_at);
};

export const resolve_rewound_generated_month = (first_removed_month: Date, starts_at_month: Date): Date | null => {
  const previous_month = add_months(first_removed_month, -1);

  return previous_month.getTime() < to_month_start(starts_at_month).getTime() ? null : previous_month;
};
