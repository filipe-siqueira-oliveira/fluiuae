import { cookies } from "next/headers";
import { environment } from "./environment";
import { create_session_token, read_session_token } from "./session_token";
import type { SessionPayload } from "@/types/session";

export const write_session_cookie = async (payload: SessionPayload): Promise<void> => {
  const token = await create_session_token(payload);
  const cookie_store = await cookies();

  cookie_store.set(environment.session_cookie_name(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: environment.is_production(),
    path: "/",
    maxAge: environment.session_max_age_seconds(),
  });
};

export const clear_session_cookie = async (): Promise<void> => {
  const cookie_store = await cookies();
  cookie_store.delete(environment.session_cookie_name());
};

export const read_session_cookie = async (): Promise<SessionPayload | null> => {
  const cookie_store = await cookies();
  const token = cookie_store.get(environment.session_cookie_name())?.value;

  if (!token) {
    return null;
  }

  return read_session_token(token);
};
