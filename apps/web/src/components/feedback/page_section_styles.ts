import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { lead_text, media_mobile, page_title_text, section_title_text } from "@/styles/typography";

const { colors, font_sizes, radii } = theme_tokens;

export type SectionLevel = "page" | "section";

export const SectionBlock = styled.section`
  min-width: 0;

  & + & {
    margin-top: 40px;
  }
`;

export const SectionHeader = styled.header<{ $level: SectionLevel }>`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
  margin-bottom: ${({ $level }) => ($level === "page" ? "28px" : "16px")};

  ${media_mobile} {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: ${({ $level }) => ($level === "page" ? "20px" : "12px")};
  }
`;

export const SectionHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  max-width: 62ch;
`;

export const SectionTitle = styled.h2<{ $level: SectionLevel }>`
  ${({ $level }) => ($level === "page" ? page_title_text : section_title_text)}
`;

export const SectionDescription = styled.p<{ $level: SectionLevel }>`
  ${lead_text}
  font-size: ${({ $level }) => ($level === "page" ? font_sizes.body_large : font_sizes.body)};

  ${media_mobile} {
    font-size: ${font_sizes.body};
  }
`;

export const SectionActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  ${media_mobile} {
    & > * {
      flex: 1;
    }
  }
`;

export const SectionIntro = styled.div`
  margin-bottom: 20px;

  ${media_mobile} {
    margin-bottom: 16px;
  }
`;

export const SectionPanel = styled.div<{ $is_flush_on_mobile: boolean }>`
  min-width: 0;
  padding: 8px 24px 20px;
  border: 1px solid ${colors.border};
  border-radius: ${radii.panel};
  background: ${colors.surface};

  ${media_mobile} {
    padding: ${({ $is_flush_on_mobile }) => ($is_flush_on_mobile ? "0" : "4px 16px 16px")};
    border-color: ${({ $is_flush_on_mobile }) => ($is_flush_on_mobile ? "transparent" : colors.border)};
    border-radius: 16px;
    background: ${({ $is_flush_on_mobile }) => ($is_flush_on_mobile ? "transparent" : colors.surface)};
  }
`;
