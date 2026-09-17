import { http_client, unwrap_response } from "@/lib/http_client";
import type { DashboardWidgetKey } from "@/lib/dashboard_widgets";

export const save_dashboard_widgets_request = async (widgets: DashboardWidgetKey[]): Promise<DashboardWidgetKey[]> =>
  unwrap_response<{ widgets: DashboardWidgetKey[] }>((await http_client.put("/dashboard/preferences", { widgets })).data).widgets;
