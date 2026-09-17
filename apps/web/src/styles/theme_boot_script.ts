import { theme_storage_key } from "./theme_preference_storage";

export const theme_boot_script = `(() => {
  try {
    document.documentElement.dataset.theme = localStorage.getItem("${theme_storage_key}") === "dark" ? "dark" : "light";
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
})();`;
