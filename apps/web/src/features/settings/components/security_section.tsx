"use client";

import { useState } from "react";
import { App, Button } from "antd";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageSection } from "@/components/feedback/page_section";
import { use_sign_out } from "@/features/auth/hooks/use_sign_out";
import {
  change_password_request,
  update_email_request,
  type EmailPayload,
  type PasswordPayload,
} from "../api/settings_api";
import { describe_request_error } from "@/lib/http_client";
import { EmailChangeModal } from "./email_change_modal";
import { PasswordChangeModal } from "./password_change_modal";
import { SettingsRow } from "./settings_row";
import type { ProfileDto } from "@/types/api";

type SecuritySectionProps = {
  profile: ProfileDto;
  on_updated: (profile: ProfileDto) => void;
};

export const SecuritySection = ({ profile, on_updated }: SecuritySectionProps) => {
  const router = useRouter();
  const { message } = App.useApp();
  const { sign_out } = use_sign_out();
  const [open_modal, set_open_modal] = useState<"email" | "password" | null>(null);
  const [is_submitting, set_is_submitting] = useState(false);

  const run = async (action: () => Promise<void>, success: string) => {
    set_is_submitting(true);

    try {
      await action();
      set_open_modal(null);
      message.success(success);
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <PageSection tour_prefix="settings_security" level="section" title="Acesso e segurança" description="Como você entra no FluiuAê.">
      <SettingsRow title="E-mail" description={profile.email}>
        <Button onClick={() => set_open_modal("email")}>Alterar e-mail</Button>
      </SettingsRow>
      <SettingsRow title="Senha" description="Use pelo menos 8 caracteres. Uma frase fácil de lembrar funciona bem.">
        <Button onClick={() => set_open_modal("password")}>Alterar senha</Button>
      </SettingsRow>
      <SettingsRow title="Sair da conta" description="Encerra o acesso neste navegador.">
        <Button danger icon={<LogOut size={16} />} onClick={() => void sign_out()}>
          Sair
        </Button>
      </SettingsRow>
      <EmailChangeModal
        is_open={open_modal === "email"}
        is_submitting={is_submitting}
        current_email={profile.email}
        on_cancel={() => set_open_modal(null)}
        on_submit={(payload: EmailPayload) =>
          run(async () => on_updated(await update_email_request(payload)), "E-mail alterado")
        }
      />
      <PasswordChangeModal
        is_open={open_modal === "password"}
        is_submitting={is_submitting}
        on_cancel={() => set_open_modal(null)}
        on_submit={(payload: PasswordPayload) => run(() => change_password_request(payload), "Senha alterada")}
      />
    </PageSection>
  );
};
