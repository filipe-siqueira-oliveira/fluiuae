"use client";

import { Button, Descriptions, Modal } from "antd";
import { ModalFooterWithDelete } from "@/components/feedback/modal_footer_with_delete";
import { format_date } from "@/lib/date_formatter";
import { translate_invitation_status } from "../helpers/invitation_labels";
import { translate_member_role } from "../helpers/role_labels";
import type { InvitationDto } from "@/types/api";

type InvitationDetailsModalProps = {
  invitation: InvitationDto | null;
  is_revoking: boolean;
  on_close: () => void;
  on_revoke: (invitation: InvitationDto) => void;
};

export const InvitationDetailsModal = ({
  invitation,
  is_revoking,
  on_close,
  on_revoke,
}: InvitationDetailsModalProps) => (
  <Modal
    open={Boolean(invitation)}
    title="Convite pendente"
    onCancel={on_close}
    destroyOnHidden
    footer={
      <ModalFooterWithDelete
        delete_label="Cancelar convite"
        confirm_message="Cancelar este convite? O link enviado por e-mail para de funcionar."
        is_delete_visible={Boolean(invitation)}
        is_deleting={is_revoking}
        on_delete={() => invitation && on_revoke(invitation)}
      >
        <Button onClick={on_close}>Fechar</Button>
      </ModalFooterWithDelete>
    }
  >
    {invitation ? (
      <Descriptions column={1} size="small">
        <Descriptions.Item label="E-mail">{invitation.email}</Descriptions.Item>
        <Descriptions.Item label="Papel">{translate_member_role(invitation.role)}</Descriptions.Item>
        <Descriptions.Item label="Situação">{translate_invitation_status(invitation.status)}</Descriptions.Item>
        <Descriptions.Item label="Expira em">{format_date(invitation.expires_at)}</Descriptions.Item>
      </Descriptions>
    ) : null}
  </Modal>
);
