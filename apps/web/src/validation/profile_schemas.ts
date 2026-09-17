import { z } from "zod";

export const update_profile_schema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[\d\s()+-]*$/, "invalid_phone")
    .optional()
    .nullable()
    .transform((value) => value || null),
});

export const update_email_schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  current_password: z.string().min(1),
});

export const change_password_schema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8).max(72),
});

export const rename_workspace_schema = z.object({
  name: z.string().trim().min(2).max(80),
});

export type UpdateProfileInput = z.infer<typeof update_profile_schema>;
export type UpdateEmailInput = z.infer<typeof update_email_schema>;
export type ChangePasswordInput = z.infer<typeof change_password_schema>;
export type RenameWorkspaceInput = z.infer<typeof rename_workspace_schema>;
