"use client";

import {
  SettingsRow as RowFrame,
  SettingsRowControl,
  SettingsRowDescription,
  SettingsRowText,
  SettingsRowTitle,
} from "./settings_styles";

type SettingsRowProps = {
  title: string;
  description: React.ReactNode;
  children?: React.ReactNode;
};

export const SettingsRow = ({ title, description, children }: SettingsRowProps) => (
  <RowFrame>
    <SettingsRowText>
      <SettingsRowTitle>{title}</SettingsRowTitle>
      <SettingsRowDescription>{description}</SettingsRowDescription>
    </SettingsRowText>
    {children ? <SettingsRowControl>{children}</SettingsRowControl> : null}
  </RowFrame>
);
