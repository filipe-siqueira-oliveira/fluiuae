import axios, { AxiosError } from "axios";
import { translate_error } from "./error_messages";
import type { ApiFailure, ApiSuccess } from "@/types/api";

export const http_client = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "content-type": "application/json" },
});

const read_first_detail = (details: unknown): string | null => {
  if (!details || typeof details !== "object") {
    return null;
  }

  const first_field = Object.values(details as Record<string, string[] | undefined>).find(
    (messages) => Array.isArray(messages) && messages.length > 0
  );

  return first_field?.[0] ?? null;
};

export const describe_request_error = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.code === "ECONNABORTED") {
      return translate_error("request_timeout");
    }

    if (!error.response) {
      return translate_error("network_error");
    }

    const failure = error.response.data as ApiFailure | undefined;
    const detail = read_first_detail(failure?.details);

    return translate_error(detail ?? failure?.error, error.response.status);
  }

  return translate_error("unexpected_error");
};

export const unwrap_response = <T>(payload: ApiSuccess<T>): T => payload.data;
