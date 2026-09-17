import { Bricolage_Grotesque, Geist } from "next/font/google";

export const primary_font = Geist({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font_primary",
  display: "swap",
});

export const display_font = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font_display",
  display: "swap",
});
