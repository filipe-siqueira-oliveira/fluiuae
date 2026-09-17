"use client";

import { useEffect, useMemo, useState } from "react";
import { Tour, type TourProps } from "antd";
import { usePathname } from "next/navigation";
import { find_product_tour, type ProductTour as ProductTourDefinition } from "@/lib/product_tours";
import { http_client } from "@/lib/http_client";

type ProductTourProps = {
  completed_tours: string[];
};

const find_visible_target = (target: string): HTMLElement | null => {
  const elements = document.querySelectorAll<HTMLElement>(`[data-tour="${target}"]`);

  const visible = [...elements].find((element) => {
    const rect = element.getBoundingClientRect();

    return rect.width > 0 && rect.height > 0;
  });

  if (!visible) {
    return null;
  }

  let focus = visible;

  while (focus.getBoundingClientRect().height > window.innerHeight * 0.7 && focus.firstElementChild instanceof HTMLElement) {
    focus = focus.firstElementChild;
  }

  return focus;
};

const build_steps = (tour: ProductTourDefinition): TourProps["steps"] =>
  tour.steps
    .filter((step) => !step.target || find_visible_target(step.target))
    .map((step) => ({
      title: step.title,
      description: step.description,
      target: step.target ? () => find_visible_target(step.target as string) as HTMLElement : null,
      nextButtonProps: { children: "Próximo" },
      prevButtonProps: { children: "Voltar" },
    }));

export const ProductTour = ({ completed_tours }: ProductTourProps) => {
  const pathname = usePathname();
  const [completed, set_completed] = useState(() => new Set(completed_tours));
  const [active_tour, set_active_tour] = useState<ProductTourDefinition | null>(null);
  const [steps, set_steps] = useState<TourProps["steps"]>([]);
  const [current, set_current] = useState(0);

  useEffect(() => {
    set_completed(new Set(completed_tours));
  }, [completed_tours]);

  useEffect(() => {
    set_active_tour(null);
    const tour = find_product_tour(pathname);

    if (!tour || completed.has(tour.key)) {
      return;
    }

    const timeout_id = window.setTimeout(() => {
      set_steps(build_steps(tour));
      set_current(0);
      set_active_tour(tour);
    }, 900);

    return () => window.clearTimeout(timeout_id);
  }, [completed, pathname]);

  const finish = () => {
    if (!active_tour) {
      return;
    }

    const tour_key = active_tour.key;
    set_active_tour(null);
    set_completed((previous) => new Set(previous).add(tour_key));
    void http_client.post(`/tours/${tour_key}`).catch(() => undefined);
  };

  const last_index = (steps?.length ?? 1) - 1;
  const decorated_steps = useMemo(
    () =>
      steps?.map((step, index) =>
        index === last_index ? { ...step, nextButtonProps: { children: "Entendi" } } : step
      ),
    [last_index, steps]
  );

  return (
    <Tour
      open={Boolean(active_tour) && Boolean(steps?.length)}
      steps={decorated_steps}
      current={current}
      onChange={set_current}
      onClose={finish}
      onFinish={finish}
      indicatorsRender={(index, total) => `${index + 1} de ${total}`}
      scrollIntoViewOptions={{ block: "center", behavior: "smooth" }}
      zIndex={1200}
    />
  );
};
