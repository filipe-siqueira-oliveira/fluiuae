"use client";

import { MessageCircle } from "lucide-react";
import styled from "styled-components";
import { StatusPill } from "@/components/data/status_pill";
import { PageSection } from "@/components/feedback/page_section";
import { theme_tokens } from "@/styles/theme_tokens";
import { SettingsRow } from "./settings_row";
import { DisabledSection } from "./settings_styles";

const TitleRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;

  svg {
    color: ${theme_tokens.colors.text_subtle};
  }
`;

export const WhatsappSection = () => (
  <PageSection
    level="section"
    title="WhatsApp"
    description="Receber avisos e lançar gastos conversando pelo WhatsApp."
    actions={
      <TitleRow>
        <MessageCircle size={16} aria-hidden="true" />
        <StatusPill tone="pending">Em construção</StatusPill>
      </TitleRow>
    }
  >
    <DisabledSection aria-disabled="true">
      <SettingsRow title="Conectar número" description="Ainda não disponível. Avisamos aqui quando estiver pronto." />
      <SettingsRow title="Avisos de contas a vencer" description="Um lembrete no dia de cada despesa a pagar." />
    </DisabledSection>
  </PageSection>
);
