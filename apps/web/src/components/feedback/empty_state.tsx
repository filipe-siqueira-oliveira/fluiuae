"use client";

import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, section_title_text } from "@/styles/typography";

const { colors, font_sizes } = theme_tokens;

const EmptyFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 16px 40px;
  text-align: center;
`;

const EmptyTitle = styled.h3`
  ${section_title_text}
`;

const EmptyText = styled.p`
  ${caption_text}
  max-width: 44ch;
  margin-bottom: 12px;
  color: ${colors.text_muted};
  font-size: ${font_sizes.body};
  line-height: 1.5;
`;

type EmptyStateProps = {
  title: string;
  message: string;
  action?: React.ReactNode;
};

export const EmptyState = ({ title, message, action }: EmptyStateProps) => (
  <EmptyFrame>
    <EmptyTitle>{title}</EmptyTitle>
    <EmptyText>{message}</EmptyText>
    {action}
  </EmptyFrame>
);
