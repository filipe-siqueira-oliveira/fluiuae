import { MemberRole } from "@fluiuae/database/enums";

const member_role_labels: Record<MemberRole, string> = {
  [MemberRole.OWNER]: "Dono",
  [MemberRole.ADMIN]: "Administrador",
  [MemberRole.VIEWER]: "Visualizador",
};

export const translate_member_role = (role: MemberRole): string => member_role_labels[role];

export const assignable_role_options = [MemberRole.ADMIN, MemberRole.VIEWER].map((role) => ({
  value: role,
  label: member_role_labels[role],
}));
