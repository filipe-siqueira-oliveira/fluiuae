import { prisma_client } from "@fluiuae/database";
import { bad_request, conflict, not_found } from "@/lib/http_error";
import { hash_password, verify_password } from "@/lib/password_hasher";
import type { ProfileDto } from "@/types/api";
import type {
  ChangePasswordInput,
  RenameWorkspaceInput,
  UpdateEmailInput,
  UpdateProfileInput,
} from "@/validation/profile_schemas";

const find_user_or_fail = async (user_id: string) => {
  const user = await prisma_client.user.findUnique({ where: { id: user_id } });

  if (!user) {
    throw not_found("user_not_found");
  }

  return user;
};

const assert_current_password = async (password_hash: string, current_password: string): Promise<void> => {
  if (!(await verify_password(current_password, password_hash))) {
    throw bad_request("current_password_incorrect");
  }
};

export const read_profile = async (user_id: string, workspace_id: string): Promise<ProfileDto> => {
  const [user, workspace] = await Promise.all([
    find_user_or_fail(user_id),
    prisma_client.workspace.findUniqueOrThrow({ where: { id: workspace_id } }),
  ]);

  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    member_since: user.created_at.toISOString(),
    workspace_name: workspace.name,
  };
};

export const update_profile = async (user_id: string, input: UpdateProfileInput): Promise<void> => {
  await prisma_client.user.update({ where: { id: user_id }, data: { name: input.name, phone: input.phone } });
};

export const update_email = async (user_id: string, input: UpdateEmailInput): Promise<void> => {
  const user = await find_user_or_fail(user_id);
  await assert_current_password(user.password_hash, input.current_password);

  if (input.email === user.email) {
    return;
  }

  if (await prisma_client.user.findUnique({ where: { email: input.email } })) {
    throw conflict("email_already_registered");
  }

  await prisma_client.user.update({ where: { id: user_id }, data: { email: input.email } });
};

export const change_password = async (user_id: string, input: ChangePasswordInput): Promise<void> => {
  const user = await find_user_or_fail(user_id);
  await assert_current_password(user.password_hash, input.current_password);

  await prisma_client.user.update({
    where: { id: user_id },
    data: { password_hash: await hash_password(input.new_password) },
  });
};

export const rename_workspace = async (workspace_id: string, input: RenameWorkspaceInput): Promise<void> => {
  await prisma_client.workspace.update({ where: { id: workspace_id }, data: { name: input.name } });
};
