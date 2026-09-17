import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

const { colors } = theme_tokens;

export const CategoryBarList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 4px 0 0;
  list-style: none;
`;

export const CategoryBarItem = styled.li`
  display: grid;
  grid-template-columns: minmax(96px, 180px) minmax(0, 1fr);
  align-items: center;
  gap: 12px;

  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
  }
`;

export const CategoryBarName = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: ${colors.text};
  font-size: 13px;

  span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const CategoryBarDot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const CategoryBarTrack = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const CategoryBarFill = styled.span<{ $share: number }>`
  flex-shrink: 0;
  width: ${({ $share }) => `calc(${$share} * (100% - 96px))`};
  min-width: 2px;
  height: 12px;
  border-radius: 0 4px 4px 0;
  background: ${colors.text_subtle};
`;

export const CategoryBarValue = styled.span`
  flex-shrink: 0;
  color: ${colors.text};
  font-size: 13px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

export const CategoryEmptyText = styled.p`
  margin: 0;
  padding: 24px 0;
  color: ${colors.text_muted};
  font-size: 14px;
`;
