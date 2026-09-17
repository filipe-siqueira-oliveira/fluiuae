import Link from "next/link";
import styled, { css, keyframes } from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

const { colors, fonts, font_sizes } = theme_tokens;

const forest = "#0A3B28";
const forest_deep = "#062A1C";
const mint = "#C9EEDB";
const mint_muted = "rgba(201, 238, 219, 0.72)";

export const AuthPage = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  min-height: 100vh;
  min-height: 100dvh;
  background: ${colors.surface};

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto 1fr;
  }
`;

export const StoryPanel = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  padding: 56px 64px;
  overflow: hidden;
  background: radial-gradient(120% 90% at 0% 100%, #0E5A3B 0%, transparent 60%), linear-gradient(160deg, ${forest} 0%, ${forest_deep} 100%);
  color: ${mint};

  @media (max-width: 1200px) {
    padding: 48px 44px;
  }

  @media (max-width: 960px) {
    gap: 0;
    padding: 28px 20px 26px;
  }
`;

export const StoryHeadline = styled.h2`
  max-width: 13ch;
  margin: auto 0 0;
  color: #F2FBF6;
  font-family: ${fonts.display};
  font-size: clamp(44px, 5.2vw, 76px);
  font-weight: 600;
  line-height: 0.98;
  letter-spacing: -0.045em;

  @media (max-width: 960px) {
    max-width: 18ch;
    margin: 0;
    font-size: clamp(28px, 7vw, 36px);
    line-height: 1.05;
  }
`;

export const StoryText = styled.p`
  max-width: 42ch;
  margin: 20px 0 0;
  color: ${mint_muted};
  font-size: ${font_sizes.body_large};
  line-height: 1.55;

  @media (max-width: 960px) {
    display: none;
  }
`;

export const StoryFacts = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 28px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: ${mint_muted};
  font-size: ${font_sizes.body};

  li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  svg {
    color: #7FD6A8;
  }

  @media (max-width: 960px) {
    display: none;
  }
`;

const draw = keyframes`
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
`;

const appear = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const FlowIllustration = styled.svg`
  position: absolute;
  right: -2%;
  bottom: 22%;
  width: 104%;
  height: 46%;
  pointer-events: none;

  path[data-line] {
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
    animation: ${draw} 1600ms cubic-bezier(0.6, 0, 0.2, 1) both;
  }

  path[data-line="expense"] {
    animation-delay: 250ms;
  }

  circle,
  path[data-area] {
    animation: ${appear} 700ms ease 1300ms both;
  }

  @media (prefers-reduced-motion: reduce) {
    path[data-line],
    circle,
    path[data-area] {
      animation: none;
    }
  }

  @media (max-width: 960px) {
    display: none;
  }
`;

export const FormPanel = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  background: ${colors.surface};

  @media (max-width: 960px) {
    align-items: flex-start;
    padding: 28px 20px 40px;
  }
`;

export const FormColumn = styled.div`
  width: 100%;
  max-width: 400px;

  .ant-form-item-label > label {
    color: ${colors.text};
    font-weight: 500;
  }

  .ant-input-affix-wrapper,
  .ant-input {
    border-radius: 12px;
  }
`;

export const ModeSwitch = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin-bottom: 40px;
  padding: 4px;
  border-radius: 999px;
  background: ${colors.neutral_soft};

  @media (max-width: 960px) {
    margin-bottom: 28px;
  }
`;

export const ModeLink = styled(Link)<{ $is_active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: 999px;
  color: ${colors.text_muted};
  font-size: ${font_sizes.body};
  font-weight: 500;
  text-decoration: none;
  transition:
    background-color 150ms ease,
    color 150ms ease;

  &:hover {
    color: ${colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }

  ${({ $is_active }) =>
    $is_active &&
    css`
      background: ${colors.surface};
      box-shadow: 0 1px 2px ${colors.shadow_ink};
      color: ${colors.text};
      font-weight: 600;
    `}
`;

export const FormTitle = styled.h1`
  margin: 0;
  color: ${colors.text};
  font-family: ${fonts.display};
  font-size: 34px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.025em;
`;

export const FormDescription = styled.p`
  margin: 10px 0 28px;
  color: ${colors.text_muted};
  font-size: ${font_sizes.body_large};
  line-height: 1.5;
`;
