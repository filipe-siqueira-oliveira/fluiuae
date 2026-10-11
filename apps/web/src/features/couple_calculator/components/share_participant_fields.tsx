"use client";

import { ParticipantGroup, ParticipantHeading } from "./couple_calculator_styles";
import { ShareSourceField } from "./share_source_field";
import { ShareWorkspaceField } from "./share_workspace_field";
import type { FormRule } from "antd";
import type { WorkspacePaymentSourcesDto, WorkspaceSummaryDto } from "@/types/api";

type ShareParticipantFieldsProps = {
  heading: string;
  workspace_name: "first_workspace_id" | "second_workspace_id";
  source_name: "first_payment_source" | "second_payment_source";
  workspaces: WorkspaceSummaryDto[];
  sources: WorkspacePaymentSourcesDto | undefined;
  workspace_dependencies?: string[];
  workspace_rules?: FormRule[];
};

export const ShareParticipantFields = ({
  heading,
  workspace_name,
  source_name,
  workspaces,
  sources,
  workspace_dependencies,
  workspace_rules,
}: ShareParticipantFieldsProps) => (
  <ParticipantGroup role="group" aria-label={heading}>
    <ParticipantHeading>{heading}</ParticipantHeading>
    <ShareWorkspaceField
      name={workspace_name}
      label="Carteira"
      workspaces={workspaces}
      dependencies={workspace_dependencies}
      extra_rules={workspace_rules}
    />
    <ShareSourceField name={source_name} sources={sources} />
  </ParticipantGroup>
);
