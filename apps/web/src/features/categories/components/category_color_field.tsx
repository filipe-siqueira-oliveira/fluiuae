"use client";

import { ColorPicker, Tooltip } from "antd";
import { Shuffle } from "lucide-react";
import { category_color_presets, generate_random_category_color } from "../helpers/category_colors";
import {
  ColorFieldRow,
  ColorSwatch,
  ColorTrigger,
  RandomColorButton,
} from "./category_form_styles";

type CategoryColorFieldProps = {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export const CategoryColorField = ({ id, value, onChange }: CategoryColorFieldProps) => (
  <ColorFieldRow>
    <ColorPicker
      value={value}
      disabledAlpha
      format="hex"
      presets={[{ label: "Sugeridas", colors: category_color_presets, defaultOpen: true }]}
      onChange={(color) => onChange?.(color.toHexString().toUpperCase())}
    >
      <ColorTrigger id={id} type="button" aria-label={`Escolher cor, cor atual ${value ?? "nenhuma"}`}>
        <ColorSwatch $color={value} />
        {value}
      </ColorTrigger>
    </ColorPicker>
    <Tooltip title="Cor aleatória">
      <RandomColorButton
        aria-label="Gerar cor aleatória"
        icon={<Shuffle size={16} strokeWidth={1.75} />}
        onClick={() => onChange?.(generate_random_category_color(value))}
      />
    </Tooltip>
  </ColorFieldRow>
);
