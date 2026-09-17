"use client";

import { useState } from "react";
import { use_insights_request } from "@/components/charts/use_insights_request";
import { fetch_credit_card_statements } from "../api/credit_card_statements_api";

export const use_credit_card_statements = (credit_card_id: string, refresh_key: string) => {
  const [reload_count, set_reload_count] = useState(0);
  const { insights, error_message } = use_insights_request(
    () => fetch_credit_card_statements(credit_card_id),
    `${credit_card_id}:${refresh_key}:${reload_count}`
  );

  return {
    statements: insights,
    error_message,
    reload: () => set_reload_count((current_count) => current_count + 1),
  };
};
