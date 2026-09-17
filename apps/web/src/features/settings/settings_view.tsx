"use client";

import { useState } from "react";
import { PageHeader } from "@/components/feedback/page_header";
import { PreferencesSection } from "./components/preferences_section";
import { ProfileSection } from "./components/profile_section";
import { SecuritySection } from "./components/security_section";
import { SettingsStack } from "./components/settings_styles";
import { WhatsappSection } from "./components/whatsapp_section";
import { WorkspaceSection } from "./components/workspace_section";
import type { MemberRole } from "@fluiuae/database/enums";
import type { ProfileDto } from "@/types/api";

type SettingsViewProps = {
  initial_profile: ProfileDto;
  role: MemberRole;
  can_manage_workspace: boolean;
};

export const SettingsView = ({ initial_profile, role, can_manage_workspace }: SettingsViewProps) => {
  const [profile, set_profile] = useState(initial_profile);

  return (
    <SettingsStack>
      <PageHeader title="Configurações" description="Seu perfil, seu acesso e como o FluiuAê aparece para você." />
      <ProfileSection profile={profile} on_updated={set_profile} />
      <SecuritySection profile={profile} on_updated={set_profile} />
      <WorkspaceSection
        profile={profile}
        role={role}
        can_manage={can_manage_workspace}
        on_updated={set_profile}
      />
      <PreferencesSection />
      <WhatsappSection />
    </SettingsStack>
  );
};
