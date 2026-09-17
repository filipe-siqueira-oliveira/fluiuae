import { InvitationStatus } from "@fluiuae/database/enums";

const invitation_status_labels: Record<InvitationStatus, string> = {
  [InvitationStatus.PENDING]: "Pendente",
  [InvitationStatus.ACCEPTED]: "Aceito",
  [InvitationStatus.REVOKED]: "Cancelado",
  [InvitationStatus.EXPIRED]: "Expirado",
};

export const translate_invitation_status = (status: InvitationStatus): string =>
  invitation_status_labels[status];
