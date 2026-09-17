"use client";

import { useState } from "react";
import { Button, Popconfirm } from "antd";
import { Trash2 } from "lucide-react";
import styled from "styled-components";

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const PrimaryActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

type ModalFooterWithDeleteProps = {
  delete_label: string;
  confirm_message: string;
  is_delete_visible: boolean;
  is_deleting: boolean;
  on_delete: () => void;
  children: React.ReactNode;
};

export const ModalFooterWithDelete = ({
  delete_label,
  confirm_message,
  is_delete_visible,
  is_deleting,
  on_delete,
  children,
}: ModalFooterWithDeleteProps) => {
  const [is_confirm_open, set_is_confirm_open] = useState(false);

  return (
    <Footer>
      {is_delete_visible ? (
        <Popconfirm
          title={confirm_message}
          okText="Excluir"
          cancelText="Voltar"
          okButtonProps={{ danger: true }}
          open={is_confirm_open}
          onOpenChange={set_is_confirm_open}
          onConfirm={on_delete}
        >
          <Button danger type="text" icon={<Trash2 size={16} />} loading={is_deleting}>
            {delete_label}
          </Button>
        </Popconfirm>
      ) : null}
      <PrimaryActions>{children}</PrimaryActions>
    </Footer>
  );
};
