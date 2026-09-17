"use client";

import { useState } from "react";
import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

const LogoFrame = styled.span<{ $size: number; $is_circle: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  overflow: hidden;
  border: 1px solid ${theme_tokens.colors.border};
  border-radius: ${({ $size, $is_circle }) => ($is_circle ? "50%" : `${Math.round($size / 4)}px`)};
  background: ${theme_tokens.colors.surface};
  color: ${theme_tokens.colors.text_muted};
  font-size: ${({ $size }) => `${Math.round($size * 0.38)}px`};
  font-weight: 600;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const build_initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

type BankLogoProps = {
  ispb: string | null;
  name: string;
  has_logo: boolean;
  size?: number;
  is_circle?: boolean;
};

export const BankLogo = ({ ispb, name, has_logo, size = 24, is_circle = false }: BankLogoProps) => {
  const [has_failed, set_has_failed] = useState(false);
  const can_show_image = Boolean(ispb) && has_logo && !has_failed;

  return (
    <LogoFrame $size={size} $is_circle={is_circle} aria-hidden="true">
      {can_show_image ? (
        <img src={`/bank_logos/${ispb}.png`} alt="" onError={() => set_has_failed(true)} />
      ) : (
        build_initials(name)
      )}
    </LogoFrame>
  );
};
