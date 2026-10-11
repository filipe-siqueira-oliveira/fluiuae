"use client";

import { Form, Select, type FormRule } from "antd";
import { describe_workspace_title } from "@/features/workspaces/helpers/workspace_labels";
import type { WorkspaceSummaryDto } from "@/types/api";

type ShareWorkspaceFieldProps = {
  name: "first_workspace_id" | "second_workspace_id";
  label: string;
  workspaces: WorkspaceSummaryDto[];
  dependencies?: string[];
  extra_rules?: FormRule[];
};

export const ShareWorkspaceField = ({ name, label, workspaces, dependencies, extra_rules = [] }: ShareWorkspaceFieldProps) => (
  <Form.Item
    name={name}
    label={label}
    dependencies={dependencies}
    rules={[{ required: true, message: "Escolha a carteira" }, ...extra_rules]}
  >
    <Select
      options={workspaces.map((workspace) => ({ value: workspace.id, label: describe_workspace_title(workspace) }))}
    />
  </Form.Item>
);
