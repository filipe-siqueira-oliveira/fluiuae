"use client";

import { useEffect, useRef, useState } from "react";
import { list_workspace_payment_sources_request } from "../api/shared_purchase_api";
import type { WorkspacePaymentSourcesDto } from "@/types/api";

export type PaymentSourcesByWorkspace = Record<string, WorkspacePaymentSourcesDto>;

const id_separator = ",";

export const use_workspace_payment_sources = (workspace_ids: (string | undefined)[]): PaymentSourcesByWorkspace => {
  const [sources_by_workspace, set_sources_by_workspace] = useState<PaymentSourcesByWorkspace>({});
  const requested_ids = useRef(new Set<string>());
  const workspace_ids_key = workspace_ids.filter(Boolean).join(id_separator);

  useEffect(() => {
    for (const workspace_id of workspace_ids_key.split(id_separator)) {
      if (!workspace_id || requested_ids.current.has(workspace_id)) {
        continue;
      }

      requested_ids.current.add(workspace_id);

      list_workspace_payment_sources_request(workspace_id)
        .then((sources) => set_sources_by_workspace((current) => ({ ...current, [workspace_id]: sources })))
        .catch(() => requested_ids.current.delete(workspace_id));
    }
  }, [workspace_ids_key]);

  return sources_by_workspace;
};
