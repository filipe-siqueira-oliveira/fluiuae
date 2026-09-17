"use client";

import { useEffect, useState } from "react";
import { App, Button, Switch } from "antd";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { http_client } from "@/lib/http_client";
import { PageSection } from "@/components/feedback/page_section";
import { read_sidebar_locked, store_sidebar_locked } from "@/components/layout/use_sidebar_collapse";
import { use_theme_preference } from "@/providers/theme_preference_provider";
import { dark_colors, light_colors } from "@/styles/color_schemes";
import type { ThemePreference } from "@/styles/theme_preference_storage";
import { SettingsRow } from "./settings_row";
import { ThemeOptionButton, ThemeOptions, ThemePreview } from "./settings_styles";

const theme_options: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
];

const preview_colors = {
  light: { background: light_colors.page_background, surface: light_colors.surface, line: light_colors.border },
  dark: { background: dark_colors.page_background, surface: dark_colors.surface, line: dark_colors.border },
};

export const PreferencesSection = () => {
  const { preference, set_preference } = use_theme_preference();
  const router = useRouter();
  const { message } = App.useApp();

  const reset_tours = async () => {
    await http_client.delete("/tours");
    message.success("As explicações vão aparecer de novo em cada tela");
    router.refresh();
  };
  const [is_sidebar_locked, set_is_sidebar_locked] = useState(false);

  useEffect(() => {
    set_is_sidebar_locked(read_sidebar_locked());
  }, []);

  return (
    <PageSection tour_prefix="settings_preferences" level="section" title="Preferências" description="Vale só para este navegador.">
      <SettingsRow title="Tema" description="Escolha as cores que ficam melhores para você.">
        <ThemeOptions role="radiogroup" aria-label="Tema">
          {theme_options.map((option) => (
            <ThemeOptionButton
              key={option.value}
              type="button"
              role="radio"
              aria-checked={preference === option.value}
              $is_selected={preference === option.value}
              onClick={() => set_preference(option.value)}
            >
              <ThemePreview
                aria-hidden="true"
                $background={preview_colors[option.value].background}
                $surface={preview_colors[option.value].surface}
                $line={preview_colors[option.value].line}
              />
              {option.label}
            </ThemeOptionButton>
          ))}
        </ThemeOptions>
      </SettingsRow>
      <SettingsRow
        title="Manter menu lateral recolhido"
        description="Mostra só os ícones no computador e esconde o botão de abrir e fechar o menu."
      >
        <Switch
          checked={is_sidebar_locked}
          aria-label="Manter menu lateral recolhido"
          onChange={(checked) => {
            set_is_sidebar_locked(checked);
            store_sidebar_locked(checked);
          }}
        />
      </SettingsRow>
      <SettingsRow title="Explicações das telas" description="Mostra de novo o passo a passo da primeira visita em cada tela.">
        <Button icon={<RotateCcw size={16} />} onClick={() => void reset_tours()}>
          Ver de novo
        </Button>
      </SettingsRow>
    </PageSection>
  );
};
