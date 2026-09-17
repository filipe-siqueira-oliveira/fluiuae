"use client";

import { useEffect, useState } from "react";
import { Drawer } from "antd";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  DrawerBrand,
  DrawerLogo,
  MobileBar,
  MobileBarSpacer,
  MobileBrand,
  MobileMenuButton,
} from "./mobile_navigation_styles";
import { SidebarPanel } from "./sidebar_panel";
import type { WorkspaceNavigation } from "./workspace_navigation";
import type { AuthenticatedUser } from "@/types/session";

type MobileNavigationProps = {
  user: AuthenticatedUser;
  workspace_navigation: WorkspaceNavigation;
};

export const MobileNavigation = ({ user, workspace_navigation }: MobileNavigationProps) => {
  const pathname = usePathname();
  const [is_open, set_is_open] = useState(false);

  useEffect(() => {
    set_is_open(false);
  }, [pathname]);

  return (
    <>
      <MobileBar>
        <MobileBrand aria-hidden="true" />
        <MobileBarSpacer />
        <MobileMenuButton
          type="button"
          aria-label="Abrir menu"
          aria-expanded={is_open}
          aria-controls="mobile_navigation_drawer"
          onClick={() => set_is_open(true)}
        >
          <Menu size={22} strokeWidth={1.75} />
        </MobileMenuButton>
      </MobileBar>
      <Drawer
        id="mobile_navigation_drawer"
        open={is_open}
        placement="left"
        width="min(320px, 86vw)"
        closable={false}
        onClose={() => set_is_open(false)}
        styles={{ body: { padding: "0 12px 12px", display: "flex", flexDirection: "column" } }}
      >
        <DrawerBrand>
          <DrawerLogo aria-hidden="true" />
          <MobileMenuButton type="button" aria-label="Fechar menu" onClick={() => set_is_open(false)}>
            <X size={22} strokeWidth={1.75} />
          </MobileMenuButton>
        </DrawerBrand>
        <SidebarPanel user={user} workspace_navigation={workspace_navigation} is_collapsed={false} is_brand_visible={false} />
      </Drawer>
    </>
  );
};
