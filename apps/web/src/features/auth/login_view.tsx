"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { App } from "antd";
import { describe_request_error } from "@/lib/http_client";
import { AuthCard } from "./components/auth_card";
import { LoginForm } from "./components/login_form";
import { sign_in, type LoginPayload } from "./api/auth_api";

export const LoginView = () => {
  const router = useRouter();
  const search_params = useSearchParams();
  const { message } = App.useApp();
  const [is_submitting, set_is_submitting] = useState(false);

  const handle_submit = async (payload: LoginPayload) => {
    set_is_submitting(true);

    try {
      await sign_in(payload);
      router.replace(search_params.get("redirect_to") ?? "/home");
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <AuthCard
      mode="login"
      title="Que bom ver você de novo"
      description="Entre com seu e-mail e senha."
    >
      <LoginForm is_submitting={is_submitting} on_submit={handle_submit} />
    </AuthCard>
  );
};
