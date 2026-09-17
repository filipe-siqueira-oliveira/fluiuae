import { NextResponse } from "next/server";
import { prisma_client } from "@fluiuae/database";

export const dynamic = "force-dynamic";

const required_variables = ["DATABASE_URL", "JWT_SECRET"];

const describe_failure = (error: unknown) => {
  const failure = error as { name?: string; code?: string; errorCode?: string };

  return { name: failure.name ?? "unknown", code: failure.code ?? failure.errorCode ?? null };
};

export const GET = async () => {
  const missing_variables = required_variables.filter((variable_name) => !process.env[variable_name]);

  try {
    await prisma_client.$queryRaw`select 1`;

    return NextResponse.json({ database: "ok", missing_variables });
  } catch (error) {
    return NextResponse.json({ database: describe_failure(error), missing_variables }, { status: 503 });
  }
};
