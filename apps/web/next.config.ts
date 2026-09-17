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
    "/**/*": ["../../node_modules/.prisma/client/**/*"],
  },
  transpilePackages: ["@fluiuae/database", "@ant-design/icons", "antd"],
  serverExternalPackages: ["@prisma/client", ".prisma/client", "bcryptjs", "logos-bancos-br"],
};

export default next_config;
