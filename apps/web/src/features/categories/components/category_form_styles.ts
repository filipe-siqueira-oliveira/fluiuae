import { Button } from "antd";
import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

const { colors } = theme_tokens;

export const FieldLabel = styled.span`
  color: ${colors.text_muted};
  font-size: ${theme_tokens.font_sizes.caption};
  font-weight: 500;
`;

export const ColorFieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;


export const ColorTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 4px;
  border: 1px solid ${colors.border_strong};
  border-radius: 12px;
  background: ${colors.surface};
  color: ${colors.text_muted};
  font-family: inherit;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;

  &:hover {
    border-color: ${colors.text_subtle};
  }
`;

export const ColorSwatch = styled.span<{ $color?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: ${({ $color }) => $color ?? colors.border};
  box-shadow: inset 0 0 0 1px rgba(16, 24, 40, 0.12);
`;

export const RandomColorButton = styled(Button)`
  && {
    width: 42px;
    height: 42px;
  }
`;
