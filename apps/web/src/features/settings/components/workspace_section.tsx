"use client";

import { useState } from "react";
import { App, Button, Input, Space } from "antd";
import { Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageSection } from "@/components/feedback/page_section";
import { translate_member_role } from "@/features/members/helpers/role_labels";
import { rename_workspace_request } from "../api/settings_api";
import { describe_request_error } from "@/lib/http_client";
import { SettingsRow } from "./settings_row";
import type { MemberRole } from "@fluiuae/database/enums";
import type { ProfileDto } from "@/types/api";

type WorkspaceSectionProps = {
  profile: ProfileDto;
  role: MemberRole;
  can_manage: boolean;
  on_updated: (profile: ProfileDto) => void;
};

export const WorkspaceSection = ({ profile, role, can_manage, on_updated }: WorkspaceSectionProps) => {
  const router = useRouter();
  const { message } = App.useApp();
  const [name, set_name] = useState(profile.workspace_name);
  const [is_saving, set_is_saving] = useState(false);
  const has_changed = name.trim() !== profile.workspace_name && name.trim().length >= 2;

  const save_name = async () => {
    set_is_saving(true);

    try {
      on_updated(await rename_workspace_request(name.trim()));
      message.success("Nome da carteira salvo");
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_saving(false);
    }
  };

  return (
    <PageSection tour_prefix="settings_workspace" level="section" title="Carteira" description="O espaço onde ficam suas contas, cartões e lançamentos.">
      <SettingsRow
        title="Nome da carteira"
        description={can_manage ? "Aparece para quem você convidar." : "Só o dono da carteira pode mudar o nome."}
      >
        <Space.Compact style={{ width: "min(100%, 360px)" }}>
          <Input
            value={name}
            disabled={!can_manage}
            maxLength={80}
            aria-label="Nome da carteira"
            onChange={(event) => set_name(event.target.value)}
            onPressEnter={() => has_changed && void save_name()}
          />
          {can_manage ? (
            <Button type="primary" disabled={!has_changed} loading={is_saving} onClick={() => void save_name()}>
              Salvar
            </Button>
          ) : null}
        </Space.Compact>
      </SettingsRow>
      <SettingsRow title="Seu papel" description={`Você é ${translate_member_role(role).toLowerCase()} desta carteira.`}>
        <Link href="/members">
          <Button icon={<Users size={16} />}>Ver membros</Button>
        </Link>
      </SettingsRow>
    </PageSection>
  );
};
