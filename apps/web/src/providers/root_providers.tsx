"use client";

import { AntdProvider } from "./antd_provider";
import { AppMantineProvider } from "./mantine_provider";
import { StyledComponentsRegistry } from "./styled_components_registry";
import { ThemePreferenceProvider } from "./theme_preference_provider";
import { GlobalStyles } from "@/styles/global_styles";

type RootProvidersProps = {
  children: React.ReactNode;
};

export const RootProviders = ({ children }: RootProvidersProps) => (
  <StyledComponentsRegistry>
    <GlobalStyles />
    <ThemePreferenceProvider>
      <AntdProvider>
        <AppMantineProvider>{children}</AppMantineProvider>
      </AntdProvider>
    </ThemePreferenceProvider>
  </StyledComponentsRegistry>
);
