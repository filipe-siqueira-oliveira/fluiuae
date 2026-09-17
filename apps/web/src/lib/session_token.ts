import { SignJWT, jwtVerify } from "jose";
import { environment } from "./environment";
import type { SessionPayload } from "@/types/session";

const encode_secret = (): Uint8Array => new TextEncoder().encode(environment.jwt_secret());

export const create_session_token = async (payload: SessionPayload): Promise<string> => {
  const issued_at = Math.floor(Date.now() / 1000);

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(issued_at)
    .setExpirationTime(issued_at + environment.session_max_age_seconds())
    .setSubject(payload.user_id)
    .sign(encode_secret());
};

export const read_session_token = async (token: string): Promise<SessionPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, encode_secret());

    if (!payload.user_id || !payload.workspace_id || !payload.role) {
      return null;
    }

    return {
      user_id: String(payload.user_id),
      workspace_id: String(payload.workspace_id),
      role: payload.role as SessionPayload["role"],
    };
  } catch {
    return null;
  }
};
