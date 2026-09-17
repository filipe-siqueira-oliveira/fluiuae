export const MemberRole = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  VIEWER: "VIEWER",
} as const;

export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole];

export const InvitationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REVOKED: "REVOKED",
  EXPIRED: "EXPIRED",
} as const;

export type InvitationStatus = (typeof InvitationStatus)[keyof typeof InvitationStatus];

export const AccountType = {
  CHECKING: "CHECKING",
  SAVINGS: "SAVINGS",
  SALARY: "SALARY",
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const CategoryKind = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
} as const;

export type CategoryKind = (typeof CategoryKind)[keyof typeof CategoryKind];

export const TransactionType = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
  TRANSFER: "TRANSFER",
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionStatus = {
  PAID: "PAID",
  PENDING: "PENDING",
} as const;

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const WhatsappSessionStatus = {
  DISCONNECTED: "DISCONNECTED",
  AWAITING_QR_SCAN: "AWAITING_QR_SCAN",
  CONNECTED: "CONNECTED",
  EXPIRED: "EXPIRED",
} as const;

export type WhatsappSessionStatus =
  (typeof WhatsappSessionStatus)[keyof typeof WhatsappSessionStatus];
