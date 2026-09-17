"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

type StyledComponentsRegistryProps = {
  children: React.ReactNode;
};

export const StyledComponentsRegistry = ({ children }: StyledComponentsRegistryProps) => {
  const [style_sheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = style_sheet.getStyleElement();
    style_sheet.instance.clearTag();

    return <>{styles}</>;
  });

  if (typeof window !== "undefined") {
    return <>{children}</>;
  }

  return <StyleSheetManager sheet={style_sheet.instance}>{children}</StyleSheetManager>;
};
