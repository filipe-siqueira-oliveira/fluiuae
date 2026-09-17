"use client";

import { MemberRole } from "@fluiuae/database/enums";
import { DataTable, type DataTableColumn } from "@/components/data/data_table";
import { translate_member_role } from "../helpers/role_labels";
import type { MemberDto } from "@/types/api";

type MembersTableProps = {
  members: MemberDto[];
  can_manage: boolean;
  on_open: (member: MemberDto) => void;
};

const columns: DataTableColumn<MemberDto>[] = [
  { key: "name", header: "Nome", render: (member) => member.user.name },
  { key: "email", header: "E-mail", render: (member) => member.user.email },
  { key: "phone", header: "Telefone", render: (member) => member.user.phone ?? "—" },
  { key: "role", header: "Papel", render: (member) => translate_member_role(member.role) },
];

export const MembersTable = ({ members, can_manage, on_open }: MembersTableProps) => (
  <DataTable
    columns={columns}
    rows={members}
    get_row_key={(member) => member.id}
    row_action={{
      on_click: on_open,
      describe: (member) => `Editar ${member.user.name}`,
      is_enabled: (member) => can_manage && member.role !== MemberRole.OWNER,
    }}
  />
);
