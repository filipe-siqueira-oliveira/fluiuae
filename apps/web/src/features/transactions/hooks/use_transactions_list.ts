"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { App } from "antd";
import type { Dayjs } from "dayjs";
import { describe_request_error } from "@/lib/http_client";
import { current_month, month_range } from "../helpers/transaction_month";
import {
  fetch_transactions,
  type TransactionListFilters,
  type TransactionListResult,
} from "../api/transactions_api";

export type TransactionViewFilters = Omit<TransactionListFilters, "start_date" | "end_date">;

export const use_transactions_list = (initial_result: TransactionListResult) => {
  const { message } = App.useApp();
  const [month, set_month] = useState<Dayjs>(current_month);
  const [filters, set_filters] = useState<TransactionViewFilters>({});
  const [result, set_result] = useState<TransactionListResult>(initial_result);
  const [is_loading, set_is_loading] = useState(false);
  const is_first_run = useRef(true);
  const latest_request_id = useRef(0);

  const reload = useCallback(
    async (next_month: Dayjs, next_filters: TransactionViewFilters) => {
      const request_id = latest_request_id.current + 1;
      latest_request_id.current = request_id;
      set_is_loading(true);

      try {
        const next_result = await fetch_transactions({ ...next_filters, ...month_range(next_month) });

        if (request_id === latest_request_id.current) {
          set_result(next_result);
        }
      } catch (error) {
        if (request_id === latest_request_id.current) {
          message.error(describe_request_error(error));
        }
      } finally {
        if (request_id === latest_request_id.current) {
          set_is_loading(false);
        }
      }
    },
    [message]
  );

  useEffect(() => {
    if (is_first_run.current) {
      is_first_run.current = false;
      return;
    }

    const timeout_id = setTimeout(() => {
      void reload(month, filters);
    }, 250);

    return () => clearTimeout(timeout_id);
  }, [filters, month, reload]);

  return {
    month,
    set_month,
    filters,
    set_filters,
    transactions: result.transactions,
    summary: result.summary,
    is_loading,
    reload_current: () => reload(month, filters),
  };
};
