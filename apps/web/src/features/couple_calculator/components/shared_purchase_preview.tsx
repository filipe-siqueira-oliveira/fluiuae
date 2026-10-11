import {
  PreviewAmount,
  PreviewBlock,
  PreviewCaption,
  PreviewDescription,
  PreviewHeading,
  PreviewItem,
  PreviewList,
  PreviewText,
} from "./couple_calculator_styles";
import type { SharedPurchasePreviewRow } from "../helpers/shared_purchase_preview_rows";

type SharedPurchasePreviewProps = {
  rows: SharedPurchasePreviewRow[];
};

export const SharedPurchasePreview = ({ rows }: SharedPurchasePreviewProps) => (
  <PreviewBlock>
    <PreviewHeading>Vai ser lançado</PreviewHeading>
    <PreviewList>
      {rows.map((row) => (
        <PreviewItem key={row.key}>
          <PreviewText>
            <PreviewDescription>{row.description}</PreviewDescription>
            <PreviewCaption>{row.caption}</PreviewCaption>
          </PreviewText>
          <PreviewAmount $is_income={row.is_income}>{row.amount_label}</PreviewAmount>
        </PreviewItem>
      ))}
    </PreviewList>
  </PreviewBlock>
);
