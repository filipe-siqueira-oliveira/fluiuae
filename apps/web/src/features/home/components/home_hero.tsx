"use client";

import dayjs from "dayjs";
import { Button } from "antd";
import { SlidersHorizontal } from "lucide-react";
import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { lead_text, media_mobile } from "@/styles/typography";

const { colors, fonts } = theme_tokens;

const HeroFrame = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px 24px;
  margin-bottom: 28px;

  ${media_mobile} {
    margin-bottom: 20px;
  }
`;

const Greeting = styled.h1`
  display: flex;
  flex-direction: column;
  margin: 0;
  font-family: ${fonts.display};
  font-weight: 600;
`;

const GreetingHello = styled.span`
  color: ${colors.text_muted};
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: 500;
  letter-spacing: -0.01em;
`;

const GreetingName = styled.span`
  color: ${colors.text};
  font-size: clamp(40px, 5vw, 64px);
  line-height: 1;
  letter-spacing: -0.04em;
  overflow-wrap: anywhere;
`;

const HeroMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;

  ${media_mobile} {
    align-items: stretch;
    width: 100%;
  }
`;

const Today = styled.p`
  ${lead_text}
  font-size: 15px;
  text-transform: none;
`;

type HomeHeroProps = {
  name: string;
  on_customize: () => void;
};

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export const HomeHero = ({ name, on_customize }: HomeHeroProps) => (
  <HeroFrame>
    <Greeting>
      <GreetingHello>Olá,</GreetingHello>
      <GreetingName>{name.split(" ")[0]}</GreetingName>
    </Greeting>
    <HeroMeta>
      <Today>{capitalize(dayjs().format("dddd, D [de] MMMM"))}</Today>
      <Button data-tour="home_customize" icon={<SlidersHorizontal size={16} />} onClick={on_customize}>
        Personalizar início
      </Button>
    </HeroMeta>
  </HeroFrame>
);
