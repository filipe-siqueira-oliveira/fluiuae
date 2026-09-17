import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app_shell";
import { find_authenticated_context } from "@/server/authorization/authenticated_context";
import { list_user_workspaces } from "@/server/services/workspace_access_service";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = async ({ children }: AppLayoutProps) => {
  const context = await find_authenticated_context();

  if (!context) {
    redirect("/login");
  }

  const workspaces = await list_user_workspaces(context.user.id);

  return (
    <AppShell context={context} workspaces={workspaces}>
      {children}
    </AppShell>
  );
};

export default AppLayout;
