import { compare, hash } from "bcryptjs";

const salt_rounds = 12;

export const hash_password = (plain_password: string): Promise<string> =>
  hash(plain_password, salt_rounds);

export const verify_password = (plain_password: string, password_hash: string): Promise<boolean> =>
  compare(plain_password, password_hash);
