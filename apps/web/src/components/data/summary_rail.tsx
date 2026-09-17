"use client";

import {
  RailContent,
  RailFrame,
  RailHint,
  RailLabel,
  RailSegment,
  RailValue,
  type SummaryTone,
} from "./summary_rail_styles";

export type SummaryRailItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  value?: string;
  content?: React.ReactNode;
  hint?: string;
  tone?: SummaryTone;
};

type SummaryRailProps = {
  items: SummaryRailItem[];
};

export const SummaryRail = ({ items }: SummaryRailProps) => (
  <RailFrame $count={items.length}>
    {items.map((item) => (
      <RailSegment key={item.key}>
        <RailLabel>
          {item.icon}
          {item.label}
        </RailLabel>
        {item.value !== undefined ? <RailValue $tone={item.tone ?? "neutral"}>{item.value}</RailValue> : null}
        {item.content ? <RailContent>{item.content}</RailContent> : null}
        {item.hint ? <RailHint>{item.hint}</RailHint> : null}
      </RailSegment>
    ))}
  </RailFrame>
);
