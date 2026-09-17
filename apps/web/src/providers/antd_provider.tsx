"use client";

import "@ant-design/v5-patch-for-react-19";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider } from "antd";
import pt_br from "antd/locale/pt_BR";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { antd_themes } from "@/styles/antd_theme";
import { use_theme_preference } from "./theme_preference_provider";

dayjs.locale("pt-br");

type AntdProviderProps = {
  children: React.ReactNode;
};

export const AntdProvider = ({ children }: AntdProviderProps) => {
  const { resolved_theme } = use_theme_preference();

  return (
    <AntdRegistry>
      <ConfigProvider locale={pt_br} theme={antd_themes[resolved_theme]}>
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  );
};
