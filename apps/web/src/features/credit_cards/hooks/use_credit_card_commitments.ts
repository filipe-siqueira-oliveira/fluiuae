"use client";

import { use_insights_request } from "@/components/charts/use_insights_request";
import { fetch_credit_card_commitments } from "../api/credit_card_statements_api";

export const use_credit_card_commitments = (credit_card_id: string, refresh_key: string) =>
  use_insights_request(() => fetch_credit_card_commitments(credit_card_id), `${credit_card_id}:${refresh_key}`).insights;
