"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dropdown, type MenuProps } from "antd";
import { EllipsisVertical, LogOut, Settings } from "lucide-react";
import { UserAvatar } from "@/components/data/user_avatar";
import { use_sign_out } from "@/features/auth/hooks/use_sign_out";
import {
  SidebarAvatarButton,
  SidebarUserFooter,
  SidebarUserMenuButton,
  SidebarUserName,
  SidebarUserRow,
} from "./sidebar_user_styles";
import type { AuthenticatedUser } from "@/types/session";

const settings_key = "settings";
const sign_out_key = "sign_out";

type SidebarUserMenuProps = {
  user: AuthenticatedUser;
  is_collapsed: boolean;
};

export const SidebarUserMenu = ({ user, is_collapsed }: SidebarUserMenuProps) => {
  const router = useRouter();
  const { sign_out } = use_sign_out();
  const [is_open, set_is_open] = useState(false);

  const menu: MenuProps = {
    items: [
      { key: settings_key, label: "Configurações", icon: <Settings size={16} strokeWidth={1.75} /> },
      { type: "divider" },
      { key: sign_out_key, label: "Sair", icon: <LogOut size={16} strokeWidth={1.75} />, danger: true },
    ],
    onClick: ({ key }) => {
      if (key === settings_key) {
        router.push("/settings");
      }

      if (key === sign_out_key) {
        void sign_out();
      }
    },
  };

  const menu_label = `Opções da conta de ${user.name}`;

  return (
    <SidebarUserFooter data-tour="app_user_menu">
      <Dropdown
        menu={menu}
        trigger={["click"]}
        placement={is_collapsed ? "topLeft" : "topRight"}
        open={is_open}
        onOpenChange={set_is_open}
      >
        <SidebarUserRow $is_collapsed={is_collapsed}>
          <SidebarAvatarButton type="button" aria-label={menu_label} tabIndex={is_collapsed ? 0 : -1}>
            <UserAvatar name={user.name} />
          </SidebarAvatarButton>
          <SidebarUserName $is_collapsed={is_collapsed} title={user.name}>
            {user.name}
          </SidebarUserName>
          <SidebarUserMenuButton
            type="button"
            $is_collapsed={is_collapsed}
            aria-label={menu_label}
            aria-haspopup="menu"
            aria-expanded={is_open}
          >
            <EllipsisVertical size={18} strokeWidth={1.75} />
          </SidebarUserMenuButton>
        </SidebarUserRow>
      </Dropdown>
    </SidebarUserFooter>
  );
};
