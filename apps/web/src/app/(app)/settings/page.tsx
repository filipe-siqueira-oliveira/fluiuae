import { SettingsView } from "@/features/settings/settings_view";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { can_manage_workspace } from "@/server/authorization/member_permissions";
import { read_profile } from "@/server/services/profile_service";

const SettingsPage = async () => {
  const context = await require_authenticated_context();
  const profile = await read_profile(context.user.id, context.workspace.id);

  return (
    <SettingsView
      initial_profile={profile}
      role={context.role}
      can_manage_workspace={can_manage_workspace(context.role)}
    />
  );
};

export default SettingsPage;
