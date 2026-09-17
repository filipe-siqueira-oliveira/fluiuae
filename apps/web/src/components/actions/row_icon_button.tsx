"use client";

import { forwardRef } from "react";
import { Button, Tooltip, type ButtonProps } from "antd";

type RowIconButtonProps = Omit<ButtonProps, "icon" | "onClick" | "type" | "shape"> & {
  label: string;
  icon: React.ReactNode;
  on_click?: () => void;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

export const RowIconButton = forwardRef<HTMLButtonElement, RowIconButtonProps>(
  (
    { label, icon, on_click, onClick, disabled = false, ...injected_props },
    ref
  ) => (
    <Tooltip title={disabled ? null : label}>
      <Button
        {...injected_props}
        ref={ref}
        type="text"
        shape="circle"
        aria-label={label}
        icon={icon}
        disabled={disabled}
        onClick={(event) => {
          onClick?.(event);
          on_click?.();
        }}
      />
    </Tooltip>
  )
);

RowIconButton.displayName = "RowIconButton";
