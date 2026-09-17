"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { http_client } from "@/lib/http_client";

export const use_sign_out = () => {
  const router = useRouter();
  const [is_signing_out, set_is_signing_out] = useState(false);

  const sign_out = async () => {
    set_is_signing_out(true);

    try {
      await http_client.post("/auth/logout");
      router.replace("/login");
      router.refresh();
    } finally {
      set_is_signing_out(false);
    }
  };

  return { is_signing_out, sign_out };
};
