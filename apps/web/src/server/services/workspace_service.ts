import { MemberRole, type Prisma } from "@fluiuae/database";
import { default_categories } from "@/server/seeds/default_categories";

export const create_workspace_with_defaults = async (
  transaction_client: Prisma.TransactionClient,
  input: { owner_id: string; name: string }
) => {
  const workspace = await transaction_client.workspace.create({
    data: {
      name: input.name,
      owner_id: input.owner_id,
      members: {
        create: {
          user_id: input.owner_id,
          role: MemberRole.OWNER,
        },
      },
      categories: {
        createMany: {
          data: default_categories,
        },
      },
    },
  });

  return workspace;
};
