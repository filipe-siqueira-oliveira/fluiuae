"use client";

import styled from "styled-components";
import { BankLogo } from "@/components/data/bank_logo";
import { theme_tokens } from "@/styles/theme_tokens";
import type { InstitutionDto } from "@/types/api";

const OptionRow = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const OptionName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OptionCode = styled.span`
  margin-left: auto;
  padding-left: 8px;
  color: ${theme_tokens.colors.text_subtle};
  font-size: 12px;
  font-variant-numeric: tabular-nums;
`;

type InstitutionOptionLabelProps = {
  institution: InstitutionDto;
  show_code?: boolean;
};

export const InstitutionOptionLabel = ({
  institution,
  show_code = true,
}: InstitutionOptionLabelProps) => (
  <OptionRow>
    <BankLogo
      ispb={institution.ispb}
      name={institution.name}
      has_logo={institution.has_logo}
      size={22}
    />
    <OptionName>{institution.name}</OptionName>
    {show_code && institution.compe ? <OptionCode>{institution.compe}</OptionCode> : null}
  </OptionRow>
);
