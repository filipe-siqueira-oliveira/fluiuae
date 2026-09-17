"use client";

import styled from "styled-components";
import { SectionDescription, SectionHeader, SectionHeading, SectionTitle } from "./page_section_styles";

const HeaderFrame = styled(SectionHeader)`
  margin-bottom: 4px;
`;

type PageHeaderProps = {
  title: string;
  description?: string;
};

export const PageHeader = ({ title, description }: PageHeaderProps) => (
  <HeaderFrame $level="page">
    <SectionHeading>
      <SectionTitle as="h1" $level="page">
        {title}
      </SectionTitle>
      {description ? <SectionDescription $level="page">{description}</SectionDescription> : null}
    </SectionHeading>
  </HeaderFrame>
);
