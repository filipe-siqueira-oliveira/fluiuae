import { z } from "zod";
import { payment_source_fields, refine_payment_source } from "./payment_source_schema";

const shared_purchase_share_schema = z
  .object({
    workspace_id: z.string().uuid(),
    amount: z.coerce.number().min(0),
    ...payment_source_fields,
  })
  .superRefine((value, context) => refine_payment_source(value, context, { allows_credit_card: true }));

export const create_shared_purchase_schema = z
  .object({
    description: z.string().trim().min(1).max(200),
    payer_workspace_id: z.string().uuid().nullable().default(null),
    installment_count: z.coerce.number().int().min(1).max(420).default(1),
    shares: z
      .tuple([shared_purchase_share_schema, shared_purchase_share_schema])
      .refine(([first, second]) => first.workspace_id !== second.workspace_id, {
        message: "shares_need_distinct_workspaces",
      })
      .refine(([first, second]) => first.amount + second.amount > 0, {
        message: "shared_purchase_without_amount",
      }),
  })
  .refine(
    ({ payer_workspace_id, shares }) =>
      !payer_workspace_id || shares.some((share) => share.workspace_id === payer_workspace_id),
    { message: "payer_must_be_a_participant", path: ["payer_workspace_id"] }
  );

export type CreateSharedPurchaseInput = z.infer<typeof create_shared_purchase_schema>;
export type SharedPurchaseShareInput = CreateSharedPurchaseInput["shares"][number];
