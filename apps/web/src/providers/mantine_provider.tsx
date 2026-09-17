"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import { theme_tokens } from "@/styles/theme_tokens";
import { use_theme_preference } from "./theme_preference_provider";

const mantine_theme = createTheme({
  fontFamily: theme_tokens.fonts.primary,
  primaryColor: "green",
});

type AppMantineProviderProps = {
  children: React.ReactNode;
};

export const AppMantineProvider = ({ children }: AppMantineProviderProps) => {
  const { resolved_theme } = use_theme_preference();

  return (
    <MantineProvider theme={mantine_theme} forceColorScheme={resolved_theme}>
      {children}
    </MantineProvider>
  );
};
