import { http_client } from "@/lib/http_client";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const register_account = async (payload: RegisterPayload): Promise<void> => {
  await http_client.post("/auth/register", payload);
};

export const sign_in = async (payload: LoginPayload): Promise<void> => {
  await http_client.post("/auth/login", payload);
};
