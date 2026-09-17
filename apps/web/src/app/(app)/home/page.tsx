import { HomeView } from "@/features/home/home_view";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { build_dashboard } from "@/server/services/dashboard_service";

const HomePage = async () => {
  const context = await require_authenticated_context();
  const dashboard = await build_dashboard(context.workspace.id, context.user.id);

  return <HomeView user_name={context.user.name} dashboard={dashboard} />;
};

export default HomePage;
