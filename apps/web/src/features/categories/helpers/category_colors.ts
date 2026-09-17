import type { CategoryDto } from "@/types/api";

export const category_color_presets = [
  "#E5484D",
  "#F76B15",
  "#FFB224",
  "#30A46C",
  "#12A594",
  "#05A2C2",
  "#0090FF",
  "#3E63DD",
  "#8E4EC6",
  "#D6409F",
  "#A18072",
  "#6F6E77",
];

export const suggest_category_color = (categories: CategoryDto[]): string => {
  const used_colors = new Set(categories.map((category) => category.color.toUpperCase()));

  return category_color_presets.find((color) => !used_colors.has(color)) ?? category_color_presets[0];
};

const random_between = (minimum: number, maximum: number): number =>
  minimum + Math.random() * (maximum - minimum);

const hsl_to_hex = (hue: number, saturation: number, lightness: number): string => {
  const saturation_ratio = saturation / 100;
  const lightness_ratio = lightness / 100;
  const chroma = saturation_ratio * Math.min(lightness_ratio, 1 - lightness_ratio);

  const channel = (offset: number): string => {
    const position = (offset + hue / 30) % 12;
    const value =
      lightness_ratio - chroma * Math.max(-1, Math.min(position - 3, 9 - position, 1));

    return Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase();
};

export const generate_random_category_color = (current_color?: string): string => {
  const current = current_color?.toUpperCase();
  let color = current ?? "";

  while (!color || color === current) {
    color = hsl_to_hex(random_between(0, 360), random_between(55, 80), random_between(42, 56));
  }

  return color;
};
