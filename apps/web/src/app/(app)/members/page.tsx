import { MembersView } from "@/features/members/members_view";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { can_manage_members } from "@/server/authorization/member_permissions";
import { list_invitations } from "@/server/services/invitation_service";
import { list_members } from "@/server/services/member_service";

const MembersPage = async () => {
  const context = await require_authenticated_context();
  const can_manage = can_manage_members(context.role);

  const [members, invitations] = await Promise.all([
    list_members(context.workspace.id),
    can_manage ? list_invitations(context.workspace.id) : Promise.resolve([]),
  ]);

  return <MembersView members={members} invitations={invitations} can_manage={can_manage} />;
};

export default MembersPage;
