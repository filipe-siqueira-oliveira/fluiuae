"use client";

import { useEffect, useState } from "react";

const visibility_key = "fluiuae_couple_calculator_in_sidebar";
const visibility_change_event = "fluiuae_couple_calculator_in_sidebar_change";

const read_visibility = (): boolean => {
  try {
    return window.localStorage.getItem(visibility_key) === "true";
  } catch {
    return false;
  }
};

const write_visibility = (is_visible: boolean): void => {
  try {
    window.localStorage.setItem(visibility_key, String(is_visible));
  } catch {
    return;
  }
};

export const store_couple_calculator_in_sidebar = (is_visible: boolean): void => {
  write_visibility(is_visible);
  window.dispatchEvent(new CustomEvent(visibility_change_event, { detail: is_visible }));
};

export const use_couple_calculator_in_sidebar = (): boolean => {
  const [is_visible, set_is_visible] = useState(false);

  useEffect(() => {
    set_is_visible(read_visibility());

    const handle_visibility_change = (event: Event) => set_is_visible(Boolean((event as CustomEvent<boolean>).detail));
    window.addEventListener(visibility_change_event, handle_visibility_change);

    return () => window.removeEventListener(visibility_change_event, handle_visibility_change);
  }, []);

  return is_visible;
};
