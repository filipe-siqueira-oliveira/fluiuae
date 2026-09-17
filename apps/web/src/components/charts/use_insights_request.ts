"use client";

import { useEffect, useState } from "react";
import { describe_request_error } from "@/lib/http_client";

export const use_insights_request = <TInsights>(
  load: () => Promise<TInsights>,
  request_key: string
) => {
  const [insights, set_insights] = useState<TInsights | null>(null);
  const [error_message, set_error_message] = useState<string | null>(null);

  useEffect(() => {
    let is_active = true;
    set_error_message(null);

    load()
      .then((result) => {
        if (is_active) {
          set_insights(result);
        }
      })
      .catch((error) => {
        if (is_active) {
          set_error_message(describe_request_error(error));
        }
      });

    return () => {
      is_active = false;
    };
  }, [request_key]);

  return { insights, error_message };
};
