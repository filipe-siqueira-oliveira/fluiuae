"use client";

import { Form, Input } from "antd";
import { other_institution_value } from "../helpers/institution_search";
import { InstitutionSelect } from "./institution_select";

type InstitutionFormItemsProps = {
  selected_choice?: string;
};

export const InstitutionFormItems = ({ selected_choice }: InstitutionFormItemsProps) => (
  <>
    <Form.Item name="institution_choice" label="Instituição">
      <InstitutionSelect />
    </Form.Item>
    {selected_choice === other_institution_value ? (
      <Form.Item
        name="institution"
        label="Nome da instituição"
        rules={[{ required: true, message: "Digite o nome da instituição" }]}
      >
        <Input placeholder="Ex.: Cooperativa da minha cidade" />
      </Form.Item>
    ) : null}
  </>
);
