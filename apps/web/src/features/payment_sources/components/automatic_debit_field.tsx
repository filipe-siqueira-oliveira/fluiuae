"use client";

import { Checkbox, Form } from "antd";
import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

const DebitBox = styled.div`
  margin: -4px 0 20px;
  padding: 12px 14px;
  border: 1px solid ${theme_tokens.colors.border};
  border-radius: ${theme_tokens.radii.control};
  background: ${theme_tokens.colors.page_background};

  .ant-form-item {
    margin: 0;
  }

  .ant-checkbox-wrapper {
    font-weight: 500;
  }
`;

const DebitHint = styled.p`
  margin: 4px 0 0 24px;
  color: ${theme_tokens.colors.text_muted};
  font-size: ${theme_tokens.font_sizes.caption};
  line-height: 1.45;
`;

type AutomaticDebitFieldProps = {
  is_checked: boolean;
};

export const AutomaticDebitField = ({ is_checked }: AutomaticDebitFieldProps) => (
  <DebitBox>
    <Form.Item name="is_automatic_debit" valuePropName="checked">
      <Checkbox>Débito automático</Checkbox>
    </Form.Item>
    <DebitHint>
      {is_checked
        ? "Sai da conta sozinho no dia e já fica como pago."
        : "Você faz o pix ou a transferência e marca como pago pelo botão Efetivar."}
    </DebitHint>
  </DebitBox>
);
