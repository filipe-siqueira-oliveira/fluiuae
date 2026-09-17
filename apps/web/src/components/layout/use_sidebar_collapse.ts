"use client";

import { useCallback, useEffect, useState } from "react";

const collapsed_key = "fluiuae_sidebar_collapsed";
const locked_key = "fluiuae_sidebar_locked";
const locked_change_event = "fluiuae_sidebar_locked_change";

const read_flag = (key: string): boolean => {
  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
};

const write_flag = (key: string, value: boolean): void => {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    return;
  }
};

export const read_sidebar_locked = (): boolean => read_flag(locked_key);

export const store_sidebar_locked = (is_locked: boolean): void => {
  write_flag(locked_key, is_locked);
  window.dispatchEvent(new CustomEvent(locked_change_event, { detail: is_locked }));
};

export const reset_sidebar_preferences = (): void => {
  write_flag(collapsed_key, false);
  store_sidebar_locked(false);
};

export const use_sidebar_collapse = () => {
  const [is_collapsed, set_is_collapsed] = useState(false);
  const [is_locked, set_is_locked] = useState(false);

  useEffect(() => {
    set_is_collapsed(read_flag(collapsed_key));
    set_is_locked(read_flag(locked_key));

    const handle_locked_change = (event: Event) => set_is_locked(Boolean((event as CustomEvent<boolean>).detail));
    window.addEventListener(locked_change_event, handle_locked_change);

    return () => window.removeEventListener(locked_change_event, handle_locked_change);
  }, []);

  const toggle_collapse = useCallback(() => {
    set_is_collapsed((current_value) => {
      const next_value = !current_value;
      write_flag(collapsed_key, next_value);

      return next_value;
    });
  }, []);

  return { is_collapsed: is_locked || is_collapsed, is_locked, toggle_collapse };
};
