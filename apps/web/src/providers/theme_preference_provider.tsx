"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ResolvedTheme } from "@/styles/antd_theme";
import { theme_storage_key, type ThemePreference } from "@/styles/theme_preference_storage";

export type { ThemePreference };

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  resolved_theme: ResolvedTheme;
  set_preference: (preference: ThemePreference) => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

const read_stored_preference = (): ThemePreference => {
  try {
    return window.localStorage.getItem(theme_storage_key) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

type ThemePreferenceProviderProps = {
  children: React.ReactNode;
};

export const ThemePreferenceProvider = ({ children }: ThemePreferenceProviderProps) => {
  const [preference, set_preference_state] = useState<ThemePreference>("light");
  const [is_ready, set_is_ready] = useState(false);

  useEffect(() => {
    set_preference_state(read_stored_preference());
    set_is_ready(true);
  }, []);

  useEffect(() => {
    if (is_ready) {
      document.documentElement.dataset.theme = preference;
    }
  }, [is_ready, preference]);

  const set_preference = useCallback((next_preference: ThemePreference) => {
    try {
      window.localStorage.setItem(theme_storage_key, next_preference);
    } catch {}

    set_preference_state(next_preference);
  }, []);

  const value = useMemo(
    () => ({ preference, resolved_theme: preference, set_preference }),
    [preference, set_preference]
  );

  return <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>;
};

export const use_theme_preference = (): ThemePreferenceContextValue => {
  const context = useContext(ThemePreferenceContext);

  if (!context) {
    throw new Error("theme_preference_provider_missing");
  }

  return context;
};
