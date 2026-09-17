"use client";

import { useState } from "react";
import { App, Button } from "antd";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageSection } from "@/components/feedback/page_section";
import { BackLink } from "@/components/navigation/back_link";
import { describe_request_error } from "@/lib/http_client";
import { InvitationDetailsModal } from "./components/invitation_details_modal";
import { InvitationsTable } from "./components/invitations_table";
import { InviteMemberModal } from "./components/invite_member_modal";
import { MemberEditModal } from "./components/member_edit_modal";
import { MembersTable } from "./components/members_table";
import {
  create_invitation_request,
  remove_member_request,
  revoke_invitation_request,
  update_member_role_request,
  type InvitePayload,
} from "./api/members_api";
import type { MemberRole } from "@fluiuae/database/enums";
import type { InvitationDto, MemberDto } from "@/types/api";

type MembersViewProps = {
  members: MemberDto[];
  invitations: InvitationDto[];
  can_manage: boolean;
};

export const MembersView = ({ members, invitations, can_manage }: MembersViewProps) => {
  const router = useRouter();
  const { message } = App.useApp();
  const [is_invite_open, set_is_invite_open] = useState(false);
  const [selected_member, set_selected_member] = useState<MemberDto | null>(null);
  const [selected_invitation, set_selected_invitation] = useState<InvitationDto | null>(null);
  const [pending_action, set_pending_action] = useState<"invite" | "save" | "remove" | "revoke" | null>(null);

  const run_action = async (
    action: typeof pending_action,
    request: () => Promise<void>,
    on_success: () => void,
    success_message?: string
  ) => {
    set_pending_action(action);

    try {
      await request();
      on_success();

      if (success_message) {
        message.success(success_message);
      }

      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_pending_action(null);
    }
  };

  return (
    <>
      <BackLink href="/settings" label="Configurações" />
      <PageSection
        title="Membros"
        description="Quem pode ver e ajudar a organizar esta carteira."
        actions={
          <Button
            type="primary"
            icon={<UserPlus size={16} />}
            disabled={!can_manage}
            onClick={() => set_is_invite_open(true)}
          >
            Convidar ajudante
          </Button>
        }
      >
        <MembersTable members={members} can_manage={can_manage} on_open={set_selected_member} />
      </PageSection>
      <PageSection title="Convites pendentes" level="section">
        <InvitationsTable invitations={invitations} can_manage={can_manage} on_open={set_selected_invitation} />
      </PageSection>
      <InviteMemberModal
        is_open={is_invite_open}
        is_submitting={pending_action === "invite"}
        on_cancel={() => set_is_invite_open(false)}
        on_submit={(payload: InvitePayload) =>
          run_action("invite", () => create_invitation_request(payload), () => set_is_invite_open(false))
        }
      />
      <MemberEditModal
        member={selected_member}
        is_submitting={pending_action === "save"}
        is_removing={pending_action === "remove"}
        on_cancel={() => set_selected_member(null)}
        on_submit={(member, role: MemberRole) =>
          run_action("save", () => update_member_role_request(member.id, role), () => set_selected_member(null), "Papel atualizado")
        }
        on_remove={(member) =>
          run_action("remove", () => remove_member_request(member.id), () => set_selected_member(null), "Membro removido")
        }
      />
      <InvitationDetailsModal
        invitation={selected_invitation}
        is_revoking={pending_action === "revoke"}
        on_close={() => set_selected_invitation(null)}
        on_revoke={(invitation) =>
          run_action(
            "revoke",
            () => revoke_invitation_request(invitation.id),
            () => set_selected_invitation(null),
            "Convite cancelado"
          )
        }
      />
    </>
  );
};
