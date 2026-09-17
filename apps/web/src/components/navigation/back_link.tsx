"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

const { colors, font_sizes } = theme_tokens;

const BackAnchor = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  margin: -8px 0 12px -10px;
  padding: 0 12px 0 10px;
  border-radius: 999px;
  color: ${colors.text_muted};
  font-size: ${font_sizes.body};
  font-weight: 500;
  text-decoration: none;
  transition:
    background-color 150ms ease,
    color 150ms ease;

  &:hover {
    background: ${colors.navigation_hover_background};
    color: ${colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

type BackLinkProps = {
  href: string;
  label: string;
};

export const BackLink = ({ href, label }: BackLinkProps) => (
  <BackAnchor href={href}>
    <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
    {label}
  </BackAnchor>
);
