import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, figure_text, label_text, media_mobile } from "@/styles/typography";

const { colors, fonts, font_sizes, radii } = theme_tokens;


export const StatementsLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
  gap: 28px;
  min-height: 520px;
  margin-top: 8px;

  ${media_mobile} {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
    min-height: 0;
  }
`;

export const StatementDetailColumn = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`;

export const StatementPurchasesScroller = styled.div`
  max-height: 60vh;
  overflow-y: auto;

  ${media_mobile} {
    max-height: none;
  }
`;

export const PurchaseDayGroup = styled.section`
  & + & {
    margin-top: 16px;
  }
`;

export const PurchaseDayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 36px;
  padding: 0 12px;
  border-radius: ${radii.small};
  background: ${colors.page_background};
  color: ${colors.text_muted};
  font-size: ${font_sizes.caption};
  font-variant-numeric: tabular-nums;
`;

export const PurchaseDayLabel = styled.h4`
  ${label_text}
  color: ${colors.text};
`;

export const PurchaseList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const PurchaseRow = styled.li`
  display: grid;
  grid-template-columns: 10px minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  min-height: 64px;
  padding: 8px 12px;

  & + & {
    border-top: 1px solid ${colors.border};
  }

  ${media_mobile} {
    gap: 12px;
    padding: 8px 4px;
  }
`;

export const PurchaseDot = styled.span<{ $color: string }>`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const PurchaseIdentity = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const PurchaseDescription = styled.span`
  overflow: hidden;
  color: ${colors.text};
  font-size: ${font_sizes.body_large};
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${media_mobile} {
    font-size: ${font_sizes.body};
  }
`;

export const PurchaseMeta = styled.span`
  ${caption_text}
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PurchaseValue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

export const PurchaseAmount = styled.span`
  color: ${colors.text};
  font-size: ${font_sizes.body_large};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  ${media_mobile} {
    font-size: ${font_sizes.body};
  }
`;

export const StatementMessage = styled.div`
  margin: 0;
  padding: 24px 12px;
  color: ${colors.text_muted};
  font-size: ${font_sizes.body};
  text-align: center;
`;

export const PaymentAmount = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 20px;
  padding: 16px;
  border-radius: ${radii.control};
  background: ${colors.page_background};

  span {
    ${label_text}
  }

  strong {
    ${figure_text}
  }
`;
