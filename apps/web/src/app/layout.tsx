import type { Metadata } from "next";
import "@mantine/core/styles.css";
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { RootProviders } from "@/providers/root_providers";
import { display_font, primary_font } from "@/styles/font_families";
import { theme_boot_script } from "@/styles/theme_boot_script";

export const metadata: Metadata = {
  title: "FluiuAê",
  description: "Controle financeiro compartilhado",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="pt-BR" className={`${primary_font.variable} ${display_font.variable}`} {...mantineHtmlProps} suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: theme_boot_script }} />
      <ColorSchemeScript />
    </head>
    <body>
      <RootProviders>{children}</RootProviders>
    </body>
  </html>
);

export default RootLayout;
