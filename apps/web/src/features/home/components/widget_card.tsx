"use client";

import styled from "styled-components";
import {
  ChartCardFrame,
  ChartCardHeader,
  ChartCardHeading,
  ChartCardSubtitle,
  ChartCardTitle,
} from "@/components/charts/chart_card_styles";

const WidgetBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`;

type WidgetCardProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export const WidgetCard = ({ title, subtitle, action, children }: WidgetCardProps) => (
  <ChartCardFrame>
    <ChartCardHeader>
      <ChartCardHeading>
        <ChartCardTitle>{title}</ChartCardTitle>
        {subtitle ? <ChartCardSubtitle>{subtitle}</ChartCardSubtitle> : null}
      </ChartCardHeading>
      {action}
    </ChartCardHeader>
    <WidgetBody>{children}</WidgetBody>
  </ChartCardFrame>
);
