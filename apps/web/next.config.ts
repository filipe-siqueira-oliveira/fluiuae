import { resolve } from "node:path";
import { config } from "dotenv";
import type { NextConfig } from "next";

config({ path: resolve(process.cwd(), "../../.env") });

const next_config: NextConfig = {
  reactStrictMode: true,
  devIndicators: {
    position: "bottom-right",
  },
  compiler: {
    styledComponents: true,
  },
  outputFileTracingRoot: resolve(process.cwd(), "../.."),
  outputFileTracingIncludes: {
    "/**/*": ["../../packages/database/generated/prisma/**/*"],
  },
  transpilePackages: ["@fluiuae/database", "@ant-design/icons", "antd"],
  serverExternalPackages: ["bcryptjs", "logos-bancos-br"],
};

export default next_config;
