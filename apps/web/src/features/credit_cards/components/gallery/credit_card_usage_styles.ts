import styled from "styled-components";
import { face_ink } from "@/components/gallery/finance_card_face_styles";
import type { CreditCardUsageLevel } from "../../helpers/credit_card_usage";

const usage_colors: Record<CreditCardUsageLevel, string> = {
  healthy: "#86EFAC",
  attention: "#FDB022",
  exceeded: "#FDA29B",
};

export const UsageTrack = styled.div`
  height: 4px;
  overflow: hidden;
  border-radius: 999px;
  background: ${face_ink.track};
`;

export const UsageFill = styled.div<{ $ratio: number; $level: CreditCardUsageLevel }>`
  width: ${({ $ratio }) => `${Math.min(Math.max($ratio, 0), 1) * 100}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ $level }) => usage_colors[$level]};
`;

export const UsageLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 12px;
  color: ${face_ink.muted};
  font-size: 12px;
`;
