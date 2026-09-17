"use client";

import { useRef, useState } from "react";
import { App, Button } from "antd";
import { SlidersHorizontal } from "lucide-react";
import { EmptyState } from "@/components/feedback/empty_state";
import { default_dashboard_widgets, type DashboardWidgetKey } from "@/lib/dashboard_widgets";
import { describe_request_error } from "@/lib/http_client";
import { save_dashboard_widgets_request } from "./api/home_api";
import { CustomizeDrawer } from "./components/customize_drawer";
import { HomeHero } from "./components/home_hero";
import { WidgetGrid, WidgetSlot } from "./components/widget_grid";
import { build_widget_layout, widget_order } from "./helpers/widget_layout";
import { widget_components } from "./helpers/widget_registry";
import type { DashboardDto } from "@/types/api";

type HomeViewProps = {
  user_name: string;
  dashboard: DashboardDto;
};

export const HomeView = ({ user_name, dashboard }: HomeViewProps) => {
  const { message } = App.useApp();
  const [widgets, set_widgets] = useState<DashboardWidgetKey[]>(dashboard.widgets);
  const [is_customizing, set_is_customizing] = useState(false);
  const last_saved = useRef(dashboard.widgets);
  const pending_widgets = useRef<DashboardWidgetKey[] | null>(null);
  const is_saving = useRef(false);

  const flush_saves = async () => {
    if (is_saving.current) {
      return;
    }

    is_saving.current = true;

    while (pending_widgets.current) {
      const next_widgets = pending_widgets.current;
      pending_widgets.current = null;

      try {
        last_saved.current = await save_dashboard_widgets_request(next_widgets);
      } catch (error) {
        if (!pending_widgets.current) {
          set_widgets(last_saved.current);
        }

        message.error(describe_request_error(error));
      }
    }

    is_saving.current = false;
  };

  const persist = (next_widgets: DashboardWidgetKey[]) => {
    set_widgets(next_widgets);
    pending_widgets.current = next_widgets;
    void flush_saves();
  };

  const toggle_widget = (key: DashboardWidgetKey, is_visible: boolean) => {
    const base_widgets = pending_widgets.current ?? widgets;

    persist(is_visible ? [...base_widgets.filter((widget) => widget !== key), key] : base_widgets.filter((widget) => widget !== key));
  };

  const visible_widgets = widget_order.filter((key) => widgets.includes(key));
  const layout = build_widget_layout(visible_widgets);

  return (
    <>
      <HomeHero name={user_name} on_customize={() => set_is_customizing(true)} />
      {visible_widgets.length === 0 ? (
        <EmptyState
          title="Seu início está vazio"
          message="Escolha os resumos e gráficos que você quer ver quando abrir o FluiuAê."
          action={
            <Button type="primary" icon={<SlidersHorizontal size={16} />} onClick={() => set_is_customizing(true)}>
              Personalizar início
            </Button>
          }
        />
      ) : (
        <WidgetGrid>
          {visible_widgets.map((key, index) => {
            const Widget = widget_components[key];

            return (
              <WidgetSlot
                data-tour={index === 1 ? "home_widgets" : undefined}
                key={key} $span={layout.desktop.get(key) ?? 12} $tablet_span={layout.tablet.get(key) ?? 12}>
                <Widget dashboard={dashboard} />
              </WidgetSlot>
            );
          })}
        </WidgetGrid>
      )}
      <CustomizeDrawer
        is_open={is_customizing}
        selected={widget_order.filter((key) => widgets.includes(key))}
        on_toggle={toggle_widget}
        on_reset={() => persist(default_dashboard_widgets)}
        on_close={() => set_is_customizing(false)}
      />
    </>
  );
};
