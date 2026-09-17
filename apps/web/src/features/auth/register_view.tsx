"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { App } from "antd";
import { describe_request_error } from "@/lib/http_client";
import { reset_sidebar_preferences } from "@/components/layout/use_sidebar_collapse";
import { AuthCard } from "./components/auth_card";
import { RegisterForm } from "./components/register_form";
import { register_account, type RegisterPayload } from "./api/auth_api";

export const RegisterView = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const [is_submitting, set_is_submitting] = useState(false);

  const handle_submit = async (payload: RegisterPayload) => {
    set_is_submitting(true);

    try {
      await register_account(payload);
      reset_sidebar_preferences();
      router.replace("/home");
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <AuthCard
      mode="register"
      title="Crie sua conta"
      description="Leva um minuto. Depois você cadastra suas contas e cartões."
    >
      <RegisterForm is_submitting={is_submitting} on_submit={handle_submit} />
    </AuthCard>
  );
};
