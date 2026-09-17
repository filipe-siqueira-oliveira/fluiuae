import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { section_title_text } from "@/styles/typography";

const { colors, font_sizes } = theme_tokens;

export const ChartCardFrame = styled.figure`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  margin: 0;
  height: 100%;
  padding: 20px;
  border: 1px solid ${colors.border};
  border-radius: ${theme_tokens.radii.panel};
  background: ${colors.surface};
`;

export const ChartCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const ChartCardHeading = styled.figcaption`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ChartCardTitle = styled.span`
  ${section_title_text}
  font-size: 17px;
`;

export const ChartCardSubtitle = styled.span`
  color: ${colors.text_muted};
  font-size: ${font_sizes.caption};
`;

export const ChartViewToggle = styled.button`
  flex-shrink: 0;
  height: 28px;
  padding: 0 10px;
  border: 1px solid ${colors.border_strong};
  border-radius: 8px;
  background: ${colors.surface};
  color: ${colors.text_muted};
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    border-color: ${colors.text_subtle};
    color: ${colors.text};
  }
`;

export const ChartPlotArea = styled.div<{ $height: number }>`
  height: ${({ $height }) => `${$height}px`};
  min-width: 0;
`;

export const ChartLegend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${colors.text_muted};
  font-size: 12px;
`;

export const ChartLegendItem = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const ChartLegendSwatch = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
`;

export const ChartDataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${font_sizes.body};
  font-variant-numeric: tabular-nums;

  th,
  td {
    height: 36px;
    padding: 0 8px;
    border-bottom: 1px solid ${colors.border};
    text-align: right;
  }

  th {
    color: ${colors.text_subtle};
    font-size: 12px;
    font-weight: 500;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;
