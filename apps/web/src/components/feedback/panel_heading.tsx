"use client";

import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, label_text, media_mobile, section_title_text } from "@/styles/typography";

const HeadingFrame = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 16px;
  padding: 18px 0 16px;
  border-bottom: 1px solid ${theme_tokens.colors.border};

  ${media_mobile} {
    padding: 14px 0 12px;
  }
`;

const HeadingText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const HeadingTitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
`;

const HeadingTitle = styled.h2`
  ${section_title_text}
`;

const HeadingMeta = styled.span`
  ${caption_text}
  font-variant-numeric: tabular-nums;
`;

const HeadingDescription = styled.p`
  ${label_text}
  font-weight: 400;
`;

const HeadingActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;

  ${media_mobile} {
    width: 100%;
  }
`;

type PanelHeadingProps = {
  title: string;
  meta?: string;
  description?: string;
  actions?: React.ReactNode;
};

export const PanelHeading = ({ title, meta, description, actions }: PanelHeadingProps) => (
  <HeadingFrame>
    <HeadingText>
      <HeadingTitleRow>
        <HeadingTitle>{title}</HeadingTitle>
        {meta ? <HeadingMeta>{meta}</HeadingMeta> : null}
      </HeadingTitleRow>
      {description ? <HeadingDescription>{description}</HeadingDescription> : null}
    </HeadingText>
    {actions ? <HeadingActions>{actions}</HeadingActions> : null}
  </HeadingFrame>
);
