import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "./http_error";
import "./zod_error_map";

export const success_response = <T>(data: T, status_code = 200) =>
  NextResponse.json({ data }, { status: status_code });

export const error_response = (error: unknown) => {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "validation_error",
        details: error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  if (error instanceof HttpError) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: error.status_code }
    );
  }

  console.error(error);

  return NextResponse.json({ error: "internal_server_error" }, { status: 500 });
};
