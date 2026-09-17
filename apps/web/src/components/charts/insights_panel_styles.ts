import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

export const InsightsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  padding: 16px;

  & > :last-child {
    grid-column: 1 / -1;
  }

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const InsightsMessage = styled.div`
  margin: 0;
  padding: 32px 16px;
  color: ${theme_tokens.colors.text_muted};
  font-size: 14px;
  text-align: center;
`;
