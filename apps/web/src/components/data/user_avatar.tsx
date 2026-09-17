"use client";

import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

const AvatarCircle = styled.span<{ $size: number }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border-radius: 50%;
  background: ${theme_tokens.colors.income_soft};
  color: ${theme_tokens.colors.primary};
  font-size: ${({ $size }) => `${Math.round($size * 0.4)}px`};
  font-weight: 600;
  line-height: 1;
  user-select: none;
`;

const build_initials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first_initial = words[0]?.[0] ?? "";
  const last_initial = words.length > 1 ? words[words.length - 1][0] : "";

  return `${first_initial}${last_initial}`.toUpperCase();
};

type UserAvatarProps = {
  name: string;
  size?: number;
};

export const UserAvatar = ({ name, size = 32 }: UserAvatarProps) => (
  <AvatarCircle $size={size} aria-hidden="true">
    {build_initials(name)}
  </AvatarCircle>
);
