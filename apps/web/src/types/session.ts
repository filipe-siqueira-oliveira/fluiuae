import type { MemberRole } from "@fluiuae/database/enums";

export type SessionPayload = {
  user_id: string;
  workspace_id: string;
  role: MemberRole;
};

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  completed_tours: string[];
};

export type AuthenticatedContext = {
  user: AuthenticatedUser;
  workspace: {
    id: string;
    name: string;
  };
  role: MemberRole;
};
