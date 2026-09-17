import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { mobile_media } from "./sidebar_layout_styles";
import { sidebar_metrics } from "./sidebar_metrics";

const { colors } = theme_tokens;

export const MobileBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 900;
  display: none;
  align-items: center;
  gap: 12px;
  height: ${sidebar_metrics.mobile_bar_height}px;
  padding: 0 8px 0 16px;
  padding-top: env(safe-area-inset-top);
  border-bottom: 1px solid ${colors.border};
  background: ${colors.translucent_bar};
  backdrop-filter: saturate(1.4) blur(12px);

  ${mobile_media} {
    display: flex;
  }
`;

export const MobileBrand = styled.span`
  flex-shrink: 0;
  width: 96px;
  height: 32px;
  border-radius: 10px;
  background: ${colors.primary};
`;

export const MobileBarSpacer = styled.span`
  flex: 1;
`;

export const MobileMenuButton = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: ${colors.text};
  cursor: pointer;

  &:hover,
  &:active {
    background: ${colors.navigation_hover_background};
  }
`;

export const DrawerBrand = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 64px;
  padding: 0 8px 0 12px;
`;

export const DrawerLogo = styled.span`
  width: 120px;
  height: 36px;
  border-radius: 12px;
  background: ${colors.primary};
`;
