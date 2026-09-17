"use client";

import { CalendarClock, CreditCard, Users } from "lucide-react";
import {
  AuthPage,
  FormColumn,
  FormDescription,
  FormPanel,
  FormTitle,
  ModeLink,
  ModeSwitch,
  StoryFacts,
  StoryHeadline,
  StoryPanel,
  StoryText,
} from "./auth_layout_styles";
import { FlowIllustration } from "./flow_illustration";

type AuthMode = "login" | "register";

type AuthCardProps = {
  mode: AuthMode;
  title: string;
  description: string;
  children: React.ReactNode;
};

const stories: Record<AuthMode, { headline: string; text: string }> = {
  login: {
    headline: "Veja para onde o seu dinheiro fluiu.",
    text: "Contas, cartões e o que ainda vai vencer, organizados mês a mês.",
  },
  register: {
    headline: "Seu dinheiro, organizado a dois.",
    text: "Comece sozinho e, quando quiser, chame alguém da família para ver e ajudar.",
  },
};

export const AuthCard = ({ mode, title, description, children }: AuthCardProps) => (
  <AuthPage>
    <StoryPanel aria-label="Sobre o FluiuAê">
      <FlowIllustration />
      <div>
        <StoryHeadline>{stories[mode].headline}</StoryHeadline>
        <StoryText>{stories[mode].text}</StoryText>
      </div>
      <StoryFacts>
        <li>
          <CalendarClock size={16} aria-hidden="true" /> Contas fixas e parcelas no dia certo
        </li>
        <li>
          <CreditCard size={16} aria-hidden="true" /> Faturas sob controle
        </li>
        <li>
          <Users size={16} aria-hidden="true" /> Ajuda de quem você confia
        </li>
      </StoryFacts>
    </StoryPanel>
    <FormPanel>
      <FormColumn>
        <ModeSwitch aria-label="Entrar ou criar conta">
          <ModeLink href="/login" $is_active={mode === "login"} aria-current={mode === "login" ? "page" : undefined}>
            Entrar
          </ModeLink>
          <ModeLink
            href="/register"
            $is_active={mode === "register"}
            aria-current={mode === "register" ? "page" : undefined}
          >
            Criar conta
          </ModeLink>
        </ModeSwitch>
        <FormTitle>{title}</FormTitle>
        <FormDescription>{description}</FormDescription>
        {children}
      </FormColumn>
    </FormPanel>
  </AuthPage>
);
