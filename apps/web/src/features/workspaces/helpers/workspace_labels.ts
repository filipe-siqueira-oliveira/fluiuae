import { MemberRole } from "@fluiuae/database/enums";
import { translate_member_role } from "@/features/members/helpers/role_labels";
import { read_first_name } from "@/lib/person_name";
import type { WorkspaceSummaryDto } from "@/types/api";

export const describe_workspace_title = (workspace: WorkspaceSummaryDto): string =>
  workspace.role === MemberRole.OWNER ? workspace.name : `Carteira de ${read_first_name(workspace.owner_name)}`;

export const describe_workspace_caption = (workspace: WorkspaceSummaryDto): string =>
  workspace.role === MemberRole.OWNER ? "Sua carteira" : `Você é ${translate_member_role(workspace.role).toLowerCase()}`;
