import type { NextResponse } from "next/server";
import { error_response, success_response } from "./api_response";

export const handle_route = async <T>(
  action: () => Promise<T>,
  status_code = 200
): Promise<NextResponse> => {
  try {
    const data = await action();

    return success_response(data, status_code);
  } catch (error) {
    return error_response(error);
  }
};

export const read_json_body = async (request: Request): Promise<unknown> => {
  try {
    return await request.json();
  } catch {
    return {};
  }
};

export const read_search_params = (request: Request): Record<string, string> =>
  Object.fromEntries(new URL(request.url).searchParams.entries());
