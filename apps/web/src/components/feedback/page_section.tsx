"use client";

import {
  SectionActions,
  SectionBlock,
  SectionDescription,
  SectionHeader,
  SectionHeading,
  SectionIntro,
  SectionPanel,
  SectionTitle,
  type SectionLevel,
} from "./page_section_styles";

type PageSectionProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  level?: SectionLevel;
  intro?: React.ReactNode;
  is_panel_flush_on_mobile?: boolean;
  tour_prefix?: string;
  children: React.ReactNode;
};

export const PageSection = ({
  title,
  description,
  actions,
  level = "page",
  intro,
  is_panel_flush_on_mobile = false,
  tour_prefix,
  children,
}: PageSectionProps) => (
  <SectionBlock data-tour={tour_prefix ? `${tour_prefix}_section` : undefined}>
    <SectionHeader $level={level}>
      <SectionHeading>
        <SectionTitle as={level === "page" ? "h1" : "h2"} $level={level}>
          {title}
        </SectionTitle>
        {description ? <SectionDescription $level={level}>{description}</SectionDescription> : null}
      </SectionHeading>
      {actions ? <SectionActions data-tour={tour_prefix ? `${tour_prefix}_actions` : undefined}>{actions}</SectionActions> : null}
    </SectionHeader>
    {intro ? <SectionIntro data-tour={tour_prefix ? `${tour_prefix}_intro` : undefined}>{intro}</SectionIntro> : null}
    <SectionPanel $is_flush_on_mobile={is_panel_flush_on_mobile} data-tour={tour_prefix ? `${tour_prefix}_panel` : undefined}>{children}</SectionPanel>
  </SectionBlock>
);
