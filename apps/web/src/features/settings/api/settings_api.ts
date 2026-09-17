import { http_client, unwrap_response } from "@/lib/http_client";
import type { ProfileDto } from "@/types/api";

export type ProfilePayload = { name: string; phone: string | null };
export type EmailPayload = { email: string; current_password: string };
export type PasswordPayload = { current_password: string; new_password: string };

export const update_profile_request = async (payload: ProfilePayload): Promise<ProfileDto> =>
  unwrap_response((await http_client.patch("/profile", payload)).data);

export const update_email_request = async (payload: EmailPayload): Promise<ProfileDto> =>
  unwrap_response((await http_client.put("/profile/email", payload)).data);

export const change_password_request = async (payload: PasswordPayload): Promise<void> => {
  await http_client.put("/profile/password", payload);
};

export const rename_workspace_request = async (name: string): Promise<ProfileDto> =>
  unwrap_response((await http_client.patch("/workspace", { name })).data);
