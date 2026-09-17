"use client";

import { useState } from "react";
import { App, Dropdown, Tooltip, type MenuProps } from "antd";
import { Check, ChevronsUpDown, Wallet } from "lucide-react";
import { describe_request_error } from "@/lib/http_client";
import { activate_workspace_request } from "@/features/workspaces/api/workspaces_api";
import {
  describe_workspace_caption,
  describe_workspace_title,
} from "@/features/workspaces/helpers/workspace_labels";
import {
  OptionCheck,
  OptionRow,
  SwitcherCaption,
  SwitcherChevron,
  SwitcherIcon,
  SwitcherSlot,
  SwitcherText,
  SwitcherTitle,
  SwitcherTrigger,
} from "./workspace_switcher_styles";
import type { WorkspaceSummaryDto } from "@/types/api";

type WorkspaceSwitcherProps = {
  workspaces: WorkspaceSummaryDto[];
  active_workspace_id: string;
  is_collapsed: boolean;
};

export const WorkspaceSwitcher = ({ workspaces, active_workspace_id, is_collapsed }: WorkspaceSwitcherProps) => {
  const { message } = App.useApp();
  const [is_open, set_is_open] = useState(false);
  const [is_switching, set_is_switching] = useState(false);
  const active_workspace = workspaces.find((workspace) => workspace.id === active_workspace_id);

  if (workspaces.length < 2 || !active_workspace) {
    return null;
  }

  const switch_workspace = async (workspace_id: string) => {
    if (workspace_id === active_workspace_id) {
      return;
    }

    set_is_switching(true);

    try {
      await activate_workspace_request(workspace_id);
      window.location.reload();
    } catch (error) {
      message.error(describe_request_error(error));
      set_is_switching(false);
    }
  };

  const menu: MenuProps = {
    items: workspaces.map((workspace) => ({
      key: workspace.id,
      label: (
        <OptionRow>
          <SwitcherText>
            <SwitcherTitle>{describe_workspace_title(workspace)}</SwitcherTitle>
            <SwitcherCaption>{describe_workspace_caption(workspace)}</SwitcherCaption>
          </SwitcherText>
          <OptionCheck $is_visible={workspace.id === active_workspace_id}>
            <Check size={16} strokeWidth={2} />
          </OptionCheck>
        </OptionRow>
      ),
    })),
    onClick: ({ key }) => void switch_workspace(key),
  };

  const active_title = describe_workspace_title(active_workspace);
  const trigger_label = `Carteira aberta: ${active_title}. Trocar de carteira`;

  return (
    <SwitcherSlot data-tour="app_workspace_switcher">
      <Dropdown
        menu={menu}
        trigger={["click"]}
        placement={is_collapsed ? "bottomLeft" : "bottom"}
        open={is_open}
        onOpenChange={set_is_open}
      >
        <Tooltip title={is_collapsed && !is_open ? active_title : null} placement="right">
          <SwitcherTrigger
            type="button"
            $is_collapsed={is_collapsed}
            aria-label={trigger_label}
            aria-haspopup="menu"
            aria-expanded={is_open}
            disabled={is_switching}
          >
            <SwitcherIcon>
              <Wallet size={17} strokeWidth={1.75} />
            </SwitcherIcon>
            {is_collapsed ? null : (
              <>
                <SwitcherText>
                  <SwitcherTitle>{active_title}</SwitcherTitle>
                  <SwitcherCaption>{describe_workspace_caption(active_workspace)}</SwitcherCaption>
                </SwitcherText>
                <SwitcherChevron>
                  <ChevronsUpDown size={16} strokeWidth={1.75} />
                </SwitcherChevron>
              </>
            )}
          </SwitcherTrigger>
        </Tooltip>
      </Dropdown>
    </SwitcherSlot>
  );
};
