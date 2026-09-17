import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

export const ShellFrame = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${theme_tokens.colors.page_background};
`;

export const ShellMain = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`;

export const ShellContent = styled.main`
  width: 100%;
  max-width: ${theme_tokens.layout.content_max_width};
  margin: 0 auto;
  padding: 44px 40px 64px;

  @media (max-width: 1024px) {
    padding: 36px 28px 56px;
  }

  @media (max-width: ${theme_tokens.layout.mobile_breakpoint}px) {
    padding: 20px 16px calc(40px + env(safe-area-inset-bottom));
  }
`;
