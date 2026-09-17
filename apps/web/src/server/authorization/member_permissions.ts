import { MemberRole } from "@fluiuae/database";
import { forbidden } from "@/lib/http_error";

const roles_that_can_read: MemberRole[] = [MemberRole.OWNER, MemberRole.ADMIN, MemberRole.VIEWER];
const roles_that_can_write: MemberRole[] = [MemberRole.OWNER, MemberRole.ADMIN];
const roles_that_can_manage_members: MemberRole[] = [MemberRole.OWNER];
const roles_that_can_manage_workspace: MemberRole[] = [MemberRole.OWNER];

export const can_read_data = (role: MemberRole): boolean => roles_that_can_read.includes(role);

export const can_write_data = (role: MemberRole): boolean => roles_that_can_write.includes(role);

export const can_manage_members = (role: MemberRole): boolean =>
  roles_that_can_manage_members.includes(role);

export const can_manage_workspace = (role: MemberRole): boolean =>
  roles_that_can_manage_workspace.includes(role);

export const assert_can_write_data = (role: MemberRole): void => {
  if (!can_write_data(role)) {
    throw forbidden("role_cannot_write_data");
  }
};

export const assert_can_manage_members = (role: MemberRole): void => {
  if (!can_manage_members(role)) {
    throw forbidden("role_cannot_manage_members");
  }
};

export const assert_can_manage_workspace = (role: MemberRole): void => {
  if (!can_manage_workspace(role)) {
    throw forbidden("role_cannot_manage_workspace");
  }
};
