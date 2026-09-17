"use client";

import { useEffect, useState } from "react";
import { fetch_institutions } from "../api/institutions_api";
import type { InstitutionDto } from "@/types/api";

export const use_institutions = () => {
  const [institutions, set_institutions] = useState<InstitutionDto[]>([]);
  const [is_loading, set_is_loading] = useState(true);
  const [has_failed, set_has_failed] = useState(false);

  useEffect(() => {
    let is_active = true;

    fetch_institutions()
      .then((result) => {
        if (is_active) {
          set_institutions(result);
        }
      })
      .catch(() => {
        if (is_active) {
          set_has_failed(true);
        }
      })
      .finally(() => {
        if (is_active) {
          set_is_loading(false);
        }
      });

    return () => {
      is_active = false;
    };
  }, []);

  return { institutions, is_loading, has_failed };
};
