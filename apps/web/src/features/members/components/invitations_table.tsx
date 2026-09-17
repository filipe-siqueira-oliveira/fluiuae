"use client";

import { DataTable, type DataTableColumn } from "@/components/data/data_table";
import { format_date } from "@/lib/date_formatter";
import { translate_invitation_status } from "../helpers/invitation_labels";
import { translate_member_role } from "../helpers/role_labels";
import type { InvitationDto } from "@/types/api";

type InvitationsTableProps = {
  invitations: InvitationDto[];
  can_manage: boolean;
  on_open: (invitation: InvitationDto) => void;
};

const columns: DataTableColumn<InvitationDto>[] = [
  { key: "email", header: "E-mail", render: (invitation) => invitation.email },
  { key: "role", header: "Papel", render: (invitation) => translate_member_role(invitation.role) },
  { key: "status", header: "Situação", render: (invitation) => translate_invitation_status(invitation.status) },
  { key: "expires_at", header: "Expira em", render: (invitation) => format_date(invitation.expires_at) },
];

export const InvitationsTable = ({ invitations, can_manage, on_open }: InvitationsTableProps) => (
  <DataTable
    columns={columns}
    rows={invitations}
    get_row_key={(invitation) => invitation.id}
    row_action={{
      on_click: on_open,
      describe: (invitation) => `Abrir convite de ${invitation.email}`,
      is_enabled: () => can_manage,
    }}
    empty_message="Nenhum convite pendente."
  />
);
