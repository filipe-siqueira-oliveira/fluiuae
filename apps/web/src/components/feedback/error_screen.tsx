"use client";

import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { lead_text, page_title_text } from "@/styles/typography";

const { colors } = theme_tokens;

const Screen = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 70vh;
  padding: 32px 16px;
  text-align: center;
  background: ${colors.page_background};
`;

const Code = styled.span`
  color: ${colors.primary};
  font-family: ${theme_tokens.fonts.display};
  font-size: 15px;
  font-weight: 600;
`;

const Title = styled.h1`
  ${page_title_text}
`;

const Text = styled.p`
  ${lead_text}
  max-width: 46ch;
  margin-bottom: 12px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

type ErrorScreenProps = {
  code: string;
  title: string;
  description: string;
  actions: React.ReactNode;
};

export const ErrorScreen = ({ code, title, description, actions }: ErrorScreenProps) => (
  <Screen>
    <Code>{code}</Code>
    <Title>{title}</Title>
    <Text>{description}</Text>
    <Actions>{actions}</Actions>
  </Screen>
);
