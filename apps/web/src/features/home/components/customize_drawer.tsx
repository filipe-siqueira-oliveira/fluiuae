"use client";

import { Button, Drawer, Switch } from "antd";
import styled from "styled-components";
import {
  dashboard_widget_definitions,
  default_dashboard_widgets,
  type DashboardWidgetGroup,
  type DashboardWidgetKey,
} from "@/lib/dashboard_widgets";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, label_text, section_title_text } from "@/styles/typography";

const { colors, font_sizes } = theme_tokens;

const GroupTitle = styled.h3`
  ${section_title_text}
  font-size: 16px;
  margin: 8px 0 4px;
`;

const OptionRow = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  cursor: pointer;

  & + & {
    border-top: 1px solid ${colors.border};
  }
`;

const OptionText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OptionTitle = styled.span`
  color: ${colors.text};
  font-size: ${font_sizes.body};
  font-weight: 500;
`;

const OptionDescription = styled.span`
  ${caption_text}
`;

const Hint = styled.p`
  ${label_text}
  font-weight: 400;
  margin-bottom: 12px;
`;

const Section = styled.section`
  & + & {
    margin-top: 20px;
  }
`;

const group_titles: Record<DashboardWidgetGroup, string> = {
  main: "Principais do mês",
  more: "Mais estatísticas",
};

type CustomizeDrawerProps = {
  is_open: boolean;
  selected: DashboardWidgetKey[];
  on_toggle: (key: DashboardWidgetKey, is_visible: boolean) => void;
  on_reset: () => void;
  on_close: () => void;
};

export const CustomizeDrawer = ({ is_open, selected, on_toggle, on_reset, on_close }: CustomizeDrawerProps) => (
  <Drawer
    open={is_open}
    onClose={on_close}
    title="Personalizar início"
    width="min(420px, 100vw)"
    footer={
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <Button
          type="text"
          disabled={default_dashboard_widgets.join() === selected.join()}
          onClick={on_reset}
        >
          Voltar ao padrão
        </Button>
        <Button type="primary" onClick={on_close}>
          Pronto
        </Button>
      </div>
    }
  >
    <Hint>Escolha o que aparece quando você abre o FluiuAê. Salva na hora e vale em qualquer aparelho.</Hint>
    {(["main", "more"] as DashboardWidgetGroup[]).map((group) => (
      <Section key={group} aria-labelledby={`widget_group_${group}`}>
        <GroupTitle id={`widget_group_${group}`}>{group_titles[group]}</GroupTitle>
        {dashboard_widget_definitions
          .filter((definition) => definition.group === group)
          .map((definition) => (
            <OptionRow key={definition.key}>
              <OptionText>
                <OptionTitle>{definition.title}</OptionTitle>
                <OptionDescription>{definition.description}</OptionDescription>
              </OptionText>
              <Switch
                checked={selected.includes(definition.key)}
                aria-label={`Mostrar ${definition.title}`}
                onChange={(checked) => on_toggle(definition.key, checked)}
              />
            </OptionRow>
          ))}
      </Section>
    ))}
  </Drawer>
);
